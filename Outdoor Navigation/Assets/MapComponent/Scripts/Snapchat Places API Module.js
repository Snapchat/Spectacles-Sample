/* // NOTE: This file contains code for accessing an external API encapsulated as a JS module. You should not modify this file.
 * // Instead, you should modify the "Snapchat Places API API" script and access the functions through the imported class wrapper.
 */

// https://docs.snap.com/api/lens-studio/Classes/ScriptObjects/#RemoteApiResponse--statusCode
const statusMessageMap = {
    0: "Unknown Status Code - Please report this as a bug.",
    1: "Success",
    2: "Redirected",
    3: "Bad Request",
    4: "Access Denied",
    5: "API Call Not Found",
    6: "Timeout",
    7: "Request Too Large",
    8: "Server Processing Error",
    9: "Request Cancelled by Caller",
    10: "Internal Framework Error",
};

class RemoteApiService {
    constructor(remoteServiceModule) {
        this.remoteServiceModule = remoteServiceModule;
    }

    async performApiRequest(endpoint, request, paramsSchema) {
        request = request || {};

        for (const [name, optional] of paramsSchema || []) {
            const value = request.parameters && request.parameters[name];
            if (!optional && value == null) {
                throw new Error(`Required parameter ${name} is missing from request.`);
            }
        }

        const req = global.RemoteApiRequest.create();
        req.endpoint = endpoint;
        if (request.parameters) req.parameters = request.parameters;
        if (request.body) req.body = request.body;

        const response = await new Promise((resolve) => { this.remoteServiceModule.performApiRequest(req, resolve) });
        if (response.statusCode !== 1) {
            const message = statusMessageMap[response.statusCode] || statusMessageMap[0];
            throw new Error(`API Call Error - ${message}: ${response.body}.`);
        }

        return {
            statusCode: response.statusCode,
            metadata: response.metadata,
            bodyAsJson: () => JSON.parse(response.body),
            bodyAsString: () => response.body,
            bodyAsResource: () => response.asResource(),
        };
    }
}

/**
 * @typedef {Object} ApiCallResponse
 * @property {number} statusCode - The integer status code of the response. The meaning of possible status code values are defined as follows:
 * <ul>
 *   <li><strong>1:</strong> Success. This code corresponds to the 2XX HTTP response status codes.</li>
 *   <li><strong>2:</strong> Redirected. This code corresponds to the 3XX HTTP response status codes.</li>
 *   <li><strong>3:</strong> Bad request. This code corresponds to the 4XX HTTP response status codes other than 401, 403, 404, 408, 413, 414, and 431, which are mapped separately below.</li>
 *   <li><strong>4:</strong> Access denied. This code corresponds to the HTTP response status codes 401 and 403.</li>
 *   <li><strong>5:</strong> Not found. This code corresponds to the HTTP response status code 404. It is also returned when the API spec is not found by the remote API service.</li>
 *   <li><strong>6:</strong> Timeout. This code corresponds to the HTTP response status codes 408 and 504.</li>
 *   <li><strong>7:</strong> Request too large. This code corresponds to the HTTP response status codes 413, 414, and 431.</li>
 *   <li><strong>8:</strong> Server error. This code corresponds to the 5XX HTTP response status codes other than 504 (timeout).</li>
 *   <li><strong>9:</strong> Request cancelled by the caller.</li>
 *   <li><strong>10:</strong> Internal error happened inside the remote API framework (i.e., not from the remote service being called).</li>
 * </ul>
 * All other values have undefined meaning and should be treated as internal error (code 10).
 * @property {Object} metadata - The key-value pairs of the response metadata.
 * @property {function(): Object} bodyAsJson - Parses the response body as a JSON object.
 * @property {function(): string} bodyAsString - Reads the response body as a string.
 * @property {function(): DynamicResource} bodyAsResource - Converts the response body into a {@link https://docs.snap.com/api/lens-studio/Classes/ScriptObjects#DynamicResource|DynamicResource} object, which can be used by the {@link https://docs.snap.com/api/lens-studio/Classes/Assets#RemoteMediaModule|RemoteMediaModule} to load the media content.
 */

/**
 * ApiModule Remote API service.
 */
class ApiModule extends RemoteApiService {
    /**
     * Performs get_place API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.place_id - place_id parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * get_place({
     *   parameters: {
     *     "place_id": "value1",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    get_place(request) {
        return this.performApiRequest("get_place", request, [
            ["place_id", false],
        ]);
    }

    /**
     * Performs get_nearby_places API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.lat - lat parameter value.
     * @param {string} request.parameters.lng - lng parameter value.
     * @param {string} request.parameters.gps_accuracy_m - gps_accuracy_m parameter value.
     * @param {string} request.parameters.places_limit - places_limit parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * get_nearby_places({
     *   parameters: {
     *     "lat": "value1",
     *     "lng": "value2",
     *     "gps_accuracy_m": "value3",
     *     "places_limit": "value4",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    get_nearby_places(request) {
        return this.performApiRequest("get_nearby_places", request, [
            ["lat", true],
            ["lng", true],
            ["gps_accuracy_m", true],
            ["places_limit", true],
        ]);
    }

    /**
     * Performs get_places_profile API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.place_ids - place_ids parameter value.
     * @param {string} request.parameters.locale - locale parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * get_places_profile({
     *   parameters: {
     *     "place_ids": "value1",
     *     "locale": "value2",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    get_places_profile(request) {
        return this.performApiRequest("get_places_profile", request, [
            ["place_ids", false],
            ["locale", true],
        ]);
    }
}

module.exports.ApiModule = ApiModule;
