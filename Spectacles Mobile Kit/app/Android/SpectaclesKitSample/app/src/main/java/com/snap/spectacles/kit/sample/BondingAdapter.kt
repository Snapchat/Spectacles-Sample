package com.snap.spectacles.kit.sample

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.snap.spectacles.kit.SpectaclesKit
import com.snap.spectacles.kit.SpectaclesSession

class BondingAdapter(
    private val context: Context,
    dataSource: List<BondingItem>,
) : ArrayAdapter<BondingAdapter.BondingItem>(
    context,
    R.layout.list_item,
    dataSource,
) {

    data class BondingItem(
        val bonding: SpectaclesKit.Bonding,
        val onActivate: () -> Unit,
        val onRemove: () -> Unit,
    )

    private class ViewHolder {
        var bondingName: TextView? = null
        var buttonRemove: View? = null
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val viewHolder: ViewHolder
        val view: View

        if (convertView == null) {
            viewHolder = ViewHolder()
            val inflater = LayoutInflater.from(context)
            view = inflater.inflate(R.layout.list_item, parent, false)
            viewHolder.bondingName = view.findViewById(R.id.bonding_name)
            viewHolder.buttonRemove = view.findViewById(R.id.button_remove)
            view.tag = viewHolder
        } else {
            view = convertView
            viewHolder = convertView.tag as ViewHolder
        }

        getItem(position)?.let { item ->
            viewHolder.bondingName?.text = item.bonding.brief(16)
            viewHolder.bondingName?.setOnClickListener {
                item.onActivate()
            }
            viewHolder.buttonRemove?.visibility = View.VISIBLE
            viewHolder.buttonRemove?.setOnClickListener {
                item.onRemove()
            }
        }
        return view
    }
}
