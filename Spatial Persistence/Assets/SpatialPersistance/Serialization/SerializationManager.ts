const SERIALIZATION_KEY = "SPATIAL_API_KEY";

const AREAS_KEY = "AREAS_KEY";
const TRANSFORM_MAT_KEY = "TRANSFORM_MAT_KEY";
const TEXT_KEY = "TEXT_KEY";
const MESH_INDEX_KEY = "MESH_INDEX_KEY";

/**
 * Association of area names to internal area ids.
 */
interface AreaNameToAreaId {
  [name: string]: string;
}

/**
 * Singleton class that handles all of the serialization logic of the lens through the persistentStorageSystem.
 * This class serializes area data (name) as well as widget data (local transform relative to the anchored parent, text content, and mesh type).
 * This class is factored to show that lens-specific content serialization is an independent concept from the spatial persistence of the AnchorModule.
 */
export class SerializationManager {
  private static instance: SerializationManager;

  // See https://developers.snap.com/lens-studio/platform-solutions/lens-cloud/persistent-cloud-storage/persistent-storage for more details of persistence.
  private persistentStorage = global.persistentStorageSystem.store;

  static getInstance(): SerializationManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SerializationManager();
    return this.instance;
  }

  /**
   * Saves the names and ids  of all created areas to use as keys in future sessions.
   * @param areas - a area names to internal area ids
   * @returns - void
   */
  public saveAreas(areas: AreaNameToAreaId): void {
    const serializedAllAreasKey = SERIALIZATION_KEY + "_" + AREAS_KEY;

    try {
      const asJson = JSON.stringify(areas);
      this.persistentStorage.putString(serializedAllAreasKey, asJson);
    } catch (e) {
      print(`Error saving: ${e}`);
    }
  }

  /**
   * Loads the names and ids  of all created areas to use as keys in future sessions.
   * @returns - a map of area to internal areaId of all areas that a user has created.
   */
  public loadAreas(): AreaNameToAreaId {
    const serializedAllAreasKey = SERIALIZATION_KEY + "_" + AREAS_KEY;
    try {
      const areasJson = this.persistentStorage.getString(serializedAllAreasKey);
      if (areasJson === "") {
        return {} as AreaNameToAreaId;
      }

      return JSON.parse(areasJson) as AreaNameToAreaId;
    } catch (e) {
      print(`Error parsing areas: ${e}`);
      print("using empty area map");
      return {} as AreaNameToAreaId;
    }
  }

  /**
   * Save the data of all widgets within the current area.
   * @param areaName - the name of the current area.
   * @param noteMats - an array of 3x3 matrices representing the local transform of each widget
   *                   (each column is local position, rotation, and scale respectively).
   * @param noteTexts - an array of strings representing the content of each widget.
   * @param noteMeshIndices - an array of numbers representing the mesh type of each widget.
   */
  public saveNotes(
    areaName: string,
    noteMats: mat3[],
    noteTexts: string[],
    noteMeshIndices: number[]
  ): void {
    const serializedAreaKey = SERIALIZATION_KEY + "_" + areaName;

    const serializedAreaMatKey = serializedAreaKey + "_" + TRANSFORM_MAT_KEY;
    const serializedAreaTextKey = serializedAreaKey + "_" + TEXT_KEY;
    const serializedAreaMeshIndicesKey =
      serializedAreaKey + "_" + MESH_INDEX_KEY;

    this.persistentStorage.putMat3Array(serializedAreaMatKey, noteMats);
    this.persistentStorage.putStringArray(serializedAreaTextKey, noteTexts);
    this.persistentStorage.putIntArray(
      serializedAreaMeshIndicesKey,
      noteMeshIndices
    );
  }

  /**
   * Loads the data of all widgets within the current area.
   * @param areaKey - the area containing the desired widget data.
   * @returns an array containing the local transforms, text contents, and mesh indices of each widget.
   */
  public loadNotes(areaKey: string): [mat3[], string[], number[]] {
    const serializedAreaKey = SERIALIZATION_KEY + "_" + areaKey;

    const noteMats = this.persistentStorage.getMat3Array(
      serializedAreaKey + "_" + TRANSFORM_MAT_KEY
    );
    const noteTexts = this.persistentStorage.getStringArray(
      serializedAreaKey + "_" + TEXT_KEY
    );
    const noteMeshIndex = this.persistentStorage.getIntArray(
      serializedAreaKey + "_" + MESH_INDEX_KEY
    );

    return [noteMats, noteTexts, noteMeshIndex];
  }

  /**
   * Deletes all data of an area with all widgets within it
   * @param areaName - the name of the area
   */
  public deleteArea(areaName: string): void {
    const serializedAreaKey = SERIALIZATION_KEY + "_" + areaName;

    const serializedAreaMatKey = serializedAreaKey + "_" + TRANSFORM_MAT_KEY;
    const serializedAreaTextKey = serializedAreaKey + "_" + TEXT_KEY;
    const serializedAreaMeshIndicesKey =
      serializedAreaKey + "_" + MESH_INDEX_KEY;

    this.persistentStorage.remove(serializedAreaMatKey);
    this.persistentStorage.remove(serializedAreaTextKey);
    this.persistentStorage.remove(serializedAreaMeshIndicesKey);

    const serializedAllAreasKey = SERIALIZATION_KEY + "_" + AREAS_KEY;

    const areas = this.loadAreas();
    delete areas[areaName];
    const asJson = JSON.stringify(areas);

    this.persistentStorage.putString(serializedAllAreasKey, asJson);
  }

  // Clear all the data in the persistent storage.
  public clearAllData(): void {
    this.persistentStorage.clear();
  }
}
