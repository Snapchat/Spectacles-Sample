package com.snap.spectacles.kit.core

/**
 * A serializer that can serialize and deserialize objects of type [SourceType] to and from objects
 * of type [SerializedType].
 */
interface Serializer<SourceType, SerializedType> {

    fun serialize(source: SourceType): SerializedType

    fun deserialize(serialized: SerializedType): SourceType
}
