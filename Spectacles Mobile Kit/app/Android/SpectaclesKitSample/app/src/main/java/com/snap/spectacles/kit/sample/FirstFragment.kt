package com.snap.spectacles.kit.sample

import android.content.pm.ApplicationInfo
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import android.widget.TextView
import com.snap.spectacles.kit.ClientException
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.SpectaclesRequestDelegate
import com.snap.spectacles.kit.SpectaclesSession
import com.snap.spectacles.kit.sample.databinding.FragmentFirstBinding
import java.io.Closeable

/**
 * A simple [Fragment] subclass as the default destination in the navigation.
 */
class FirstFragment : Fragment() {

    private var _binding: FragmentFirstBinding? = null

    private lateinit var bindingsAdapter: BondingAdapter
    private var sessionContext: SessionContext? = null
    private lateinit var messageView: TextView
    private lateinit var closeButton: View

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val binding = FragmentFirstBinding.inflate(inflater, container, false)
            .also { binding ->
                val bondingList = binding.root.findViewById<ListView>(R.id.bonding_list)
                val messagesView = binding.root.findViewById<TextView>(R.id.messages)
                closeButton = binding.root.findViewById(R.id.button_close)
                closeButton.setOnClickListener { closeSession() }
                val adapter = BondingAdapter(requireContext(), mutableListOf())
                bondingList.adapter = adapter
                messageView = messagesView
                bindingsAdapter = adapter
                _binding = binding
            }
        SpectaclesKitHolder.observeBonding(::onBondingCreated, ::onBondingError)
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onDestroy() {
        super.onDestroy()
        sessionContext?.close()
        sessionContext = null
    }

    override fun onResume() {
        super.onResume()
        updateBondingList()
    }

    private fun onBondingCreated(bonding: SpectaclesKit.Bonding) {
        updateBondingList()
        activateBonding(bonding)
    }

    private fun onBondingError(error: Exception) {
        log("!Bonding: ${error.javaClass.simpleName}(${error.message})")
        val message = when (error) {
            is ClientException.SpectaclesAppNotInstalled -> "Spectacles App is not installed."
            is ClientException.SpectaclesAppNotEnabled -> "Spectacles App is not enabled."
            is ClientException.SpectaclesAppUpdateRequired -> "Spectacles App needs to be updated."
            is ClientException -> error.message ?: "An unexpected error occurred."
            else -> "An unexpected error occurred."
        }
        activity?.runOnUiThread {
            context?.alert("Bonding Error", message)
        }
    }

    private fun onSessionStatusChanged(
        bonding: SpectaclesKit.Bonding
    ) = { status: SpectaclesSession.ConnectionStatus ->
        log("Session(${bonding.brief()}): ${status.javaClass.simpleName}")
        when (status) {
            is SpectaclesSession.ConnectionStatus.ConnectStart -> {
                // do something
            }
            is SpectaclesSession.ConnectionStatus.Connected -> {
                // do something
            }
            is SpectaclesSession.ConnectionStatus.Disconnected -> {
                // do something
            }
            is SpectaclesSession.ConnectionStatus.Error -> {
                log("!Session(${bonding.brief()}): ${status.exception.message}")
            }
        }
        activity?.runOnUiThread {
            closeButton.visibility = if (status is SpectaclesSession.ConnectionStatus.Connected) {
                View.VISIBLE
            } else {
                View.INVISIBLE
            }
        }
        Unit
    }

    private val delegateBuilder: (SpectaclesSession) -> SpectaclesRequestDelegate = {
        DemoRequestDelegate(requireContext().applicationContext, ::log)
    }

    private fun removeBonding(bonding: SpectaclesKit.Bonding) {
        activity?.runOnUiThread {
            if (sessionContext?.bonding?.id == bonding.id) {
                closeSession()
            }
            requireKit().unbind(bonding.id, {})
            updateBondingList()
        }
    }

    private fun updateBondingList() {
        bindingsAdapter.clear()
        bindingsAdapter.addAll(requireKit().availableBondings()
            .map { bonding ->
                BondingAdapter.BondingItem(
                    bonding = bonding,
                    onActivate = { activateBonding(bonding) },
                    onRemove = { removeBonding(bonding) },
                )
            }
        )
        bindingsAdapter.notifyDataSetChanged()
    }

    private fun closeSession() {
        closeButton.visibility = View.INVISIBLE
        sessionContext?.close()
        sessionContext = null
        clearLog()
    }

    private fun activateBonding(bonding: SpectaclesKit.Bonding) {
        closeSession()
        startSession(bonding)
    }

    private fun startSession(bonding: SpectaclesKit.Bonding) {
        val isAppDebuggable = context?.run {
            (applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
        } ?: false
        val session = requireKit().createSession(
            bonding = bonding,
            request = SpectaclesKit.SessionRequest.Default(
                autoReconnect = true,
                acceptUnfusedSpectacles = isAppDebuggable,
                preSharedSecret = DemoSettings.hardcodedSecret,
                acceptUntrustedLens = DemoSettings.acceptUntrustedLens
            ),
            delegateBuilder = delegateBuilder,
        )
        sessionContext = SessionContext(
            bonding,
            session,
            session.observeConnectionStatus(onSessionStatusChanged(bonding)),
        )
    }

    private fun clearLog() {
        activity?.runOnUiThread {
            messageView.text = ""
        }
    }

    private fun log(message: String) {
        activity?.runOnUiThread {
            messageView.append(
                if (message.endsWith('\n')) message else "$message\n"
            )
        }
    }
}

internal fun SpectaclesKit.Bonding.brief(length: Int = 8): String =
    "${id.substring(0 until length)}..."

private data class SessionContext(
    val bonding: SpectaclesKit.Bonding,
    val session: SpectaclesSession,
    val statusObservation: Closeable,
) {

    fun close() {
        statusObservation.close()
        session.close(null)
    }
}
