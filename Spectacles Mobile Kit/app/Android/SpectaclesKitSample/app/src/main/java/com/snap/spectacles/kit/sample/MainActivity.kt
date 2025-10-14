package com.snap.spectacles.kit.sample

import android.Manifest
import android.annotation.SuppressLint
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import android.view.Menu
import android.view.MenuItem
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import com.snap.spectacles.kit.sample.databinding.ActivityMainBinding
import java.io.Closeable

private val KIT_PERMISSIONS = arrayOf(
    Manifest.permission.BLUETOOTH_SCAN,
    Manifest.permission.BLUETOOTH_CONNECT,
)

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private var bindCloseable: Closeable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        DemoSettings.reload(this)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val navController = findNavController(R.id.nav_host_fragment_content_main)
        appBarConfiguration = AppBarConfiguration(navController.graph)
        setupActionBarWithNavController(navController, appBarConfiguration)

        SpectaclesKitHolder.create(this)
        val permissionLauncher = registerPermissionLauncher({}) {
            alert(
                title = "Permissions Needed",
                message = "This app requires certain permissions to function properly.",
            )
        }

        requireBluetoothPermission(
            onGranted = {
            },
            onNotGranted = {
                permissionLauncher.launch(KIT_PERMISSIONS)
            }
        )

        binding.fab.setOnClickListener {
            requireBluetoothPermission(
                onGranted = {
                    createBonding()
                },
                onNotGranted = {
                    permissionLauncher.launch(KIT_PERMISSIONS)
                }
            )
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        bindCloseable?.close()
        bindCloseable = null
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> {
                showSettingsDialog()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun createBonding() {
        bindCloseable?.close()
        bindCloseable = SpectaclesKitHolder.createBonding()
    }

    private fun registerPermissionLauncher(
        onGranted: () -> Unit = {},
        onNotGranted: () -> Unit,
    ) = registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
        if (KIT_PERMISSIONS.all { permissions[it] == true }) {
            // Permissions granted, proceed with Bluetooth scan
            onGranted()
        } else {
            // Permissions denied, handle accordingly
            onNotGranted()
        }
    }

    private fun requireBluetoothPermission(
        onGranted: () -> Unit,
        onNotGranted: () -> Unit,
    ) {
        when {
            KIT_PERMISSIONS.all { expectPermission(it) } -> {
                // Permissions are already granted
                onGranted()
            }
            else -> {
                // Request the necessary permissions
                onNotGranted()
            }
        }
    }

    private fun expectPermission(permission: String) =
        ContextCompat.checkSelfPermission(this, permission) ==
                PackageManager.PERMISSION_GRANTED

    @SuppressLint("MissingInflatedId")
    private fun showSettingsDialog() {
        // Show the settings fragment
        val intent = Intent().setComponent(
            ComponentName(this, SettingsActivity::class.java)
        )
        startActivity(intent)
    }
}
