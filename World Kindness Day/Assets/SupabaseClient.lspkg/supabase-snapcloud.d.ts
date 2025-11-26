declare type Hex = `0x${string}`;
declare type Address = Hex;
declare type EIP1193EventMap = {
    accountsChanged(accounts: Address[]): void;
    chainChanged(chainId: string): void;
    connect(connectInfo: {
        chainId: string;
    }): void;
    disconnect(error: {
        code: number;
        message: string;
    }): void;
    message(message: {
        type: string;
        data: unknown;
    }): void;
};
declare type EIP1193Events = {
    on<event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]): void;
    removeListener<event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]): void;
};
declare type EIP1193RequestFn = (args: {
    method: string;
    params?: unknown;
}) => Promise<unknown>;
declare type EIP1193Provider = EIP1193Events & {
    address: string;
    request: EIP1193RequestFn;
};
/**
 * EIP-4361 message fields
 */
declare type SiweMessage = {
    /**
     * The Ethereum address performing the signing.
     */
    address: Address;
    /**
     * The [EIP-155](https://eips.ethereum.org/EIPS/eip-155) Chain ID to which the session is bound,
     */
    chainId: number;
    /**
     * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority that is requesting the signing.
     */
    domain: string;
    /**
     * Time when the signed authentication message is no longer valid.
     */
    expirationTime?: Date | undefined;
    /**
     * Time when the message was generated, typically the current time.
     */
    issuedAt?: Date | undefined;
    /**
     * A random string typically chosen by the relying party and used to prevent replay attacks.
     */
    nonce?: string;
    /**
     * Time when the signed authentication message will become valid.
     */
    notBefore?: Date | undefined;
    /**
     * A system-specific identifier that may be used to uniquely refer to the sign-in request.
     */
    requestId?: string | undefined;
    /**
     * A list of information or references to information the user wishes to have resolved as part of authentication by the relying party.
     */
    resources?: string[] | undefined;
    /**
     * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme of the origin of the request.
     */
    scheme?: string | undefined;
    /**
     * A human-readable ASCII assertion that the user will sign.
     */
    statement?: string | undefined;
    /**
     * [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) URI referring to the resource that is the subject of the signing (as in the subject of a claim).
     */
    uri: string;
    /**
     * The current version of the SIWE Message.
     */
    version: '1';
};
declare type EthereumSignInInput = SiweMessage;

/**
 * Known error codes. Note that the server may also return other error codes
 * not included in this list (if the client library is older than the version
 * on the server).
 */
declare type ErrorCode = 'unexpected_failure' | 'validation_failed' | 'bad_json' | 'email_exists' | 'phone_exists' | 'bad_jwt' | 'not_admin' | 'no_authorization' | 'user_not_found' | 'session_not_found' | 'session_expired' | 'refresh_token_not_found' | 'refresh_token_already_used' | 'flow_state_not_found' | 'flow_state_expired' | 'signup_disabled' | 'user_banned' | 'provider_email_needs_verification' | 'invite_not_found' | 'bad_oauth_state' | 'bad_oauth_callback' | 'oauth_provider_not_supported' | 'unexpected_audience' | 'single_identity_not_deletable' | 'email_conflict_identity_not_deletable' | 'identity_already_exists' | 'email_provider_disabled' | 'phone_provider_disabled' | 'too_many_enrolled_mfa_factors' | 'mfa_factor_name_conflict' | 'mfa_factor_not_found' | 'mfa_ip_address_mismatch' | 'mfa_challenge_expired' | 'mfa_verification_failed' | 'mfa_verification_rejected' | 'insufficient_aal' | 'captcha_failed' | 'saml_provider_disabled' | 'manual_linking_disabled' | 'sms_send_failed' | 'email_not_confirmed' | 'phone_not_confirmed' | 'reauth_nonce_missing' | 'saml_relay_state_not_found' | 'saml_relay_state_expired' | 'saml_idp_not_found' | 'saml_assertion_no_user_id' | 'saml_assertion_no_email' | 'user_already_exists' | 'sso_provider_not_found' | 'saml_metadata_fetch_failed' | 'saml_idp_already_exists' | 'sso_domain_already_exists' | 'saml_entity_id_mismatch' | 'conflict' | 'provider_disabled' | 'user_sso_managed' | 'reauthentication_needed' | 'same_password' | 'reauthentication_not_valid' | 'otp_expired' | 'otp_disabled' | 'identity_not_found' | 'weak_password' | 'over_request_rate_limit' | 'over_email_send_rate_limit' | 'over_sms_send_rate_limit' | 'bad_code_verifier' | 'anonymous_provider_disabled' | 'hook_timeout' | 'hook_timeout_after_retry' | 'hook_payload_over_size_limit' | 'hook_payload_invalid_content_type' | 'request_timeout' | 'mfa_phone_enroll_not_enabled' | 'mfa_phone_verify_not_enabled' | 'mfa_totp_enroll_not_enabled' | 'mfa_totp_verify_not_enabled' | 'mfa_webauthn_enroll_not_enabled' | 'mfa_webauthn_verify_not_enabled' | 'mfa_verified_factor_exists' | 'invalid_credentials' | 'email_address_not_authorized' | 'email_address_invalid';

declare class AuthError extends Error {
    /**
     * Error code associated with the error. Most errors coming from
     * HTTP responses will have a code, though some errors that occur
     * before a response is received will not have one present. In that
     * case {@link #status} will also be undefined.
     */
    code: ErrorCode | (string & {}) | undefined;
    /** HTTP status code that caused the error. */
    status: number | undefined;
    protected __isAuthError: boolean;
    constructor(message: string, status?: number, code?: string);
}
declare function isAuthError(error: unknown): error is AuthError;
declare class AuthApiError extends AuthError {
    status: number;
    constructor(message: string, status: number, code: string | undefined);
}
declare function isAuthApiError(error: unknown): error is AuthApiError;
declare class AuthUnknownError extends AuthError {
    originalError: unknown;
    constructor(message: string, originalError: unknown);
}
declare class CustomAuthError extends AuthError {
    name: string;
    status: number;
    constructor(message: string, name: string, status: number, code: string | undefined);
}
declare class AuthSessionMissingError extends CustomAuthError {
    constructor();
}
declare function isAuthSessionMissingError(error: any): error is AuthSessionMissingError;
declare class AuthInvalidTokenResponseError extends CustomAuthError {
    constructor();
}
declare class AuthInvalidCredentialsError extends CustomAuthError {
    constructor(message: string);
}
declare class AuthImplicitGrantRedirectError extends CustomAuthError {
    details: {
        error: string;
        code: string;
    } | null;
    constructor(message: string, details?: {
        error: string;
        code: string;
    } | null);
    toJSON(): {
        name: string;
        message: string;
        status: number;
        details: {
            error: string;
            code: string;
        } | null;
    };
}
declare function isAuthImplicitGrantRedirectError(error: any): error is AuthImplicitGrantRedirectError;
declare class AuthPKCEGrantCodeExchangeError extends CustomAuthError {
    details: {
        error: string;
        code: string;
    } | null;
    constructor(message: string, details?: {
        error: string;
        code: string;
    } | null);
    toJSON(): {
        name: string;
        message: string;
        status: number;
        details: {
            error: string;
            code: string;
        } | null;
    };
}
declare class AuthRetryableFetchError extends CustomAuthError {
    constructor(message: string, status: number);
}
declare function isAuthRetryableFetchError(error: unknown): error is AuthRetryableFetchError;
/**
 * This error is thrown on certain methods when the password used is deemed
 * weak. Inspect the reasons to identify what password strength rules are
 * inadequate.
 */
declare class AuthWeakPasswordError extends CustomAuthError {
    /**
     * Reasons why the password is deemed weak.
     */
    reasons: WeakPasswordReasons[];
    constructor(message: string, status: number, reasons: string[]);
}
declare function isAuthWeakPasswordError(error: unknown): error is AuthWeakPasswordError;
declare class AuthInvalidJwtError extends CustomAuthError {
    constructor(message: string);
}

/**
 * A namespaced identifier in the format `${namespace}:${reference}`.
 *
 * Used by {@link IdentifierArray} and {@link IdentifierRecord}.
 *
 * @group Identifier
 */
declare type IdentifierString = `${string}:${string}`;
/**
 * A read-only array of namespaced identifiers in the format `${namespace}:${reference}`.
 *
 * Used by {@link Wallet.chains | Wallet::chains}, {@link WalletAccount.chains | WalletAccount::chains}, and
 * {@link WalletAccount.features | WalletAccount::features}.
 *
 * @group Identifier
 */
declare type IdentifierArray = readonly IdentifierString[];
/**
 * A data URI containing a base64-encoded SVG, WebP, PNG, or GIF image.
 *
 * Used by {@link Wallet.icon | Wallet::icon} and {@link WalletAccount.icon | WalletAccount::icon}.
 *
 * @group Wallet
 */
declare type WalletIcon = `data:image/${'svg+xml' | 'webp' | 'png' | 'gif'};base64,${string}`;
/**
 * Interface of a **WalletAccount**, also referred to as an **Account**.
 *
 * An account is a _read-only data object_ that is provided from the Wallet to the app, authorizing the app to use it.
 *
 * The app can use an account to display and query information from a chain.
 *
 * The app can also act using an account by passing it to {@link Wallet.features | features} of the Wallet.
 *
 * Wallets may use or extend {@link "@wallet-standard/wallet".ReadonlyWalletAccount} which implements this interface.
 *
 * @group Wallet
 */
interface WalletAccount {
    /** Address of the account, corresponding with a public key. */
    readonly address: string;
    /** Public key of the account, corresponding with a secret key to use. */
    readonly publicKey: Uint8Array;
    /**
     * Chains supported by the account.
     *
     * This must be a subset of the {@link Wallet.chains | chains} of the Wallet.
     */
    readonly chains: IdentifierArray;
    /**
     * Feature names supported by the account.
     *
     * This must be a subset of the names of {@link Wallet.features | features} of the Wallet.
     */
    readonly features: IdentifierArray;
    /** Optional user-friendly descriptive label or name for the account. This may be displayed by the app. */
    readonly label?: string;
    /** Optional user-friendly icon for the account. This may be displayed by the app. */
    readonly icon?: WalletIcon;
}
/** Input for signing in. */
interface SolanaSignInInput {
    /**
     * Optional EIP-4361 Domain.
     * If not provided, the wallet must determine the Domain to include in the message.
     */
    readonly domain?: string;
    /**
     * Optional EIP-4361 Address.
     * If not provided, the wallet must determine the Address to include in the message.
     */
    readonly address?: string;
    /**
     * Optional EIP-4361 Statement.
     * If not provided, the wallet must not include Statement in the message.
     */
    readonly statement?: string;
    /**
     * Optional EIP-4361 URI.
     * If not provided, the wallet must not include URI in the message.
     */
    readonly uri?: string;
    /**
     * Optional EIP-4361 Version.
     * If not provided, the wallet must not include Version in the message.
     */
    readonly version?: string;
    /**
     * Optional EIP-4361 Chain ID.
     * If not provided, the wallet must not include Chain ID in the message.
     */
    readonly chainId?: string;
    /**
     * Optional EIP-4361 Nonce.
     * If not provided, the wallet must not include Nonce in the message.
     */
    readonly nonce?: string;
    /**
     * Optional EIP-4361 Issued At.
     * If not provided, the wallet must not include Issued At in the message.
     */
    readonly issuedAt?: string;
    /**
     * Optional EIP-4361 Expiration Time.
     * If not provided, the wallet must not include Expiration Time in the message.
     */
    readonly expirationTime?: string;
    /**
     * Optional EIP-4361 Not Before.
     * If not provided, the wallet must not include Not Before in the message.
     */
    readonly notBefore?: string;
    /**
     * Optional EIP-4361 Request ID.
     * If not provided, the wallet must not include Request ID in the message.
     */
    readonly requestId?: string;
    /**
     * Optional EIP-4361 Resources.
     * If not provided, the wallet must not include Resources in the message.
     */
    readonly resources?: readonly string[];
}
/** Output of signing in. */
interface SolanaSignInOutput {
    /**
     * Account that was signed in.
     * The address of the account may be different from the provided input Address.
     */
    readonly account: WalletAccount;
    /**
     * Message bytes that were signed.
     * The wallet may prefix or otherwise modify the message before signing it.
     */
    readonly signedMessage: Uint8Array;
    /**
     * Message signature produced.
     * If the signature type is provided, the signature must be Ed25519.
     */
    readonly signature: Uint8Array;
    /**
     * Optional type of the message signature produced.
     * If not provided, the signature must be Ed25519.
     */
    readonly signatureType?: 'ed25519';
}

/** One of the providers supported by GoTrue. */
declare type Provider = 'apple' | 'azure' | 'bitbucket' | 'discord' | 'facebook' | 'figma' | 'github' | 'gitlab' | 'google' | 'kakao' | 'keycloak' | 'linkedin' | 'linkedin_oidc' | 'notion' | 'slack' | 'slack_oidc' | 'spotify' | 'twitch' | 'twitter' | 'workos' | 'zoom' | 'fly';
declare type AuthChangeEventMFA = 'MFA_CHALLENGE_VERIFIED';
declare type AuthChangeEvent = 'INITIAL_SESSION' | 'PASSWORD_RECOVERY' | 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | AuthChangeEventMFA;
/**
 * Provide your own global lock implementation instead of the default
 * implementation. The function should acquire a lock for the duration of the
 * `fn` async function, such that no other client instances will be able to
 * hold it at the same time.
 *
 * @experimental
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout should occur. If positive it
 *                       should throw an Error with an `isAcquireTimeout`
 *                       property set to true if the operation fails to be
 *                       acquired after this much time (ms).
 * @param fn The operation to execute when the lock is acquired.
 */
declare type LockFunc = <R>(name: string, acquireTimeout: number, fn: () => Promise<R>) => Promise<R>;
declare type GoTrueClientOptions = {
    url?: string;
    headers?: {
        [key: string]: string;
    };
    storageKey?: string;
    detectSessionInUrl?: boolean;
    autoRefreshToken?: boolean;
    persistSession?: boolean;
    storage?: SupportedStorage;
    /**
     * Stores the user object in a separate storage location from the rest of the session data. When non-null, `storage` will only store a JSON object containing the access and refresh token and some adjacent metadata, while `userStorage` will only contain the user object under the key `storageKey + '-user'`.
     *
     * When this option is set and cookie storage is used, `getSession()` and other functions that load a session from the cookie store might not return back a user. It's very important to always use `getUser()` to fetch a user object in those scenarios.
     *
     * @experimental
     */
    userStorage?: SupportedStorage;
    fetch?: Fetch$5;
    flowType?: AuthFlowType;
    debug?: boolean | ((message: string, ...args: any[]) => void);
    /**
     * Provide your own locking mechanism based on the environment. By default no locking is done at this time.
     *
     * @experimental
     */
    lock?: LockFunc;
    /**
     * Set to "true" if there is a custom authorization header set globally.
     * @experimental
     */
    hasCustomAuthorizationHeader?: boolean;
};
declare type WeakPasswordReasons = 'length' | 'characters' | 'pwned' | (string & {});
declare type WeakPassword = {
    reasons: WeakPasswordReasons[];
    message: string;
};
declare type AuthResponse = {
    data: {
        user: User | null;
        session: Session | null;
    };
    error: null;
} | {
    data: {
        user: null;
        session: null;
    };
    error: AuthError;
};
declare type AuthResponsePassword = {
    data: {
        user: User | null;
        session: Session | null;
        weak_password?: WeakPassword | null;
    };
    error: null;
} | {
    data: {
        user: null;
        session: null;
    };
    error: AuthError;
};
/**
 * AuthOtpResponse is returned when OTP is used.
 *
 * {@see AuthResponse}
 */
declare type AuthOtpResponse = {
    data: {
        user: null;
        session: null;
        messageId?: string | null;
    };
    error: null;
} | {
    data: {
        user: null;
        session: null;
        messageId?: string | null;
    };
    error: AuthError;
};
declare type AuthTokenResponse = {
    data: {
        user: User;
        session: Session;
    };
    error: null;
} | {
    data: {
        user: null;
        session: null;
    };
    error: AuthError;
};
declare type AuthTokenResponsePassword = {
    data: {
        user: User;
        session: Session;
        weakPassword?: WeakPassword;
    };
    error: null;
} | {
    data: {
        user: null;
        session: null;
        weakPassword?: null;
    };
    error: AuthError;
};
declare type OAuthResponse = {
    data: {
        provider: Provider;
        url: string;
    };
    error: null;
} | {
    data: {
        provider: Provider;
        url: null;
    };
    error: AuthError;
};
declare type SSOResponse = {
    data: {
        /**
         * URL to open in a browser which will complete the sign-in flow by
         * taking the user to the identity provider's authentication flow.
         *
         * On browsers you can set the URL to `window.location.href` to take
         * the user to the authentication flow.
         */
        url: string;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type UserResponse = {
    data: {
        user: User;
    };
    error: null;
} | {
    data: {
        user: null;
    };
    error: AuthError;
};
interface Session {
    /**
     * The oauth provider token. If present, this can be used to make external API requests to the oauth provider used.
     */
    provider_token?: string | null;
    /**
     * The oauth provider refresh token. If present, this can be used to refresh the provider_token via the oauth provider's API.
     * Not all oauth providers return a provider refresh token. If the provider_refresh_token is missing, please refer to the oauth provider's documentation for information on how to obtain the provider refresh token.
     */
    provider_refresh_token?: string | null;
    /**
     * The access token jwt. It is recommended to set the JWT_EXPIRY to a shorter expiry value.
     */
    access_token: string;
    /**
     * A one-time used refresh token that never expires.
     */
    refresh_token: string;
    /**
     * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
     */
    expires_in: number;
    /**
     * A timestamp of when the token will expire. Returned when a login is confirmed.
     */
    expires_at?: number;
    token_type: string;
    /**
     * When using a separate user storage, accessing properties of this object will throw an error.
     */
    user: User;
}
/**
 * An authentication methord reference (AMR) entry.
 *
 * An entry designates what method was used by the user to verify their
 * identity and at what time.
 *
 * @see {@link GoTrueMFAApi#getAuthenticatorAssuranceLevel}.
 */
interface AMREntry {
    /** Authentication method name. */
    method: 'password' | 'otp' | 'oauth' | 'mfa/totp' | (string & {});
    /**
     * Timestamp when the method was successfully used. Represents number of
     * seconds since 1st January 1970 (UNIX epoch) in UTC.
     */
    timestamp: number;
}
interface UserIdentity {
    id: string;
    user_id: string;
    identity_data?: {
        [key: string]: any;
    };
    identity_id: string;
    provider: string;
    created_at?: string;
    last_sign_in_at?: string;
    updated_at?: string;
}
/**
 * A MFA factor.
 *
 * @see {@link GoTrueMFAApi#enroll}
 * @see {@link GoTrueMFAApi#listFactors}
 * @see {@link GoTrueMFAAdminApi#listFactors}
 */
interface Factor {
    /** ID of the factor. */
    id: string;
    /** Friendly name of the factor, useful to disambiguate between multiple factors. */
    friendly_name?: string;
    /**
     * Type of factor. `totp` and `phone` supported with this version
     */
    factor_type: 'totp' | 'phone' | (string & {});
    /** Factor's status. */
    status: 'verified' | 'unverified';
    created_at: string;
    updated_at: string;
}
interface UserAppMetadata {
    provider?: string;
    [key: string]: any;
}
interface UserMetadata {
    [key: string]: any;
}
interface User {
    id: string;
    app_metadata: UserAppMetadata;
    user_metadata: UserMetadata;
    aud: string;
    confirmation_sent_at?: string;
    recovery_sent_at?: string;
    email_change_sent_at?: string;
    new_email?: string;
    new_phone?: string;
    invited_at?: string;
    action_link?: string;
    email?: string;
    phone?: string;
    created_at: string;
    confirmed_at?: string;
    email_confirmed_at?: string;
    phone_confirmed_at?: string;
    last_sign_in_at?: string;
    role?: string;
    updated_at?: string;
    identities?: UserIdentity[];
    is_anonymous?: boolean;
    is_sso_user?: boolean;
    factors?: Factor[];
    deleted_at?: string;
}
interface UserAttributes {
    /**
     * The user's email.
     */
    email?: string;
    /**
     * The user's phone.
     */
    phone?: string;
    /**
     * The user's password.
     */
    password?: string;
    /**
     * The nonce sent for reauthentication if the user's password is to be updated.
     *
     * Call reauthenticate() to obtain the nonce first.
     */
    nonce?: string;
    /**
     * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
     *
     * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
     *
     */
    data?: object;
}
interface AdminUserAttributes extends Omit<UserAttributes, 'data'> {
    /**
     * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
     *
     *
     * The `user_metadata` should be a JSON object that includes user-specific info, such as their first and last name.
     *
     * Note: When using the GoTrueAdminApi and wanting to modify a user's metadata,
     * this attribute is used instead of UserAttributes data.
     *
     */
    user_metadata?: object;
    /**
     * A custom data object to store the user's application specific metadata. This maps to the `auth.users.app_metadata` column.
     *
     * Only a service role can modify.
     *
     * The `app_metadata` should be a JSON object that includes app-specific info, such as identity providers, roles, and other
     * access control information.
     */
    app_metadata?: object;
    /**
     * Confirms the user's email address if set to true.
     *
     * Only a service role can modify.
     */
    email_confirm?: boolean;
    /**
     * Confirms the user's phone number if set to true.
     *
     * Only a service role can modify.
     */
    phone_confirm?: boolean;
    /**
     * Determines how long a user is banned for.
     *
     * The format for the ban duration follows a strict sequence of decimal numbers with a unit suffix.
     * Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
     *
     * For example, some possible durations include: '300ms', '2h45m'.
     *
     * Setting the ban duration to 'none' lifts the ban on the user.
     */
    ban_duration?: string | 'none';
    /**
     * The `role` claim set in the user's access token JWT.
     *
     * When a user signs up, this role is set to `authenticated` by default. You should only modify the `role` if you need to provision several levels of admin access that have different permissions on individual columns in your database.
     *
     * Setting this role to `service_role` is not recommended as it grants the user admin privileges.
     */
    role?: string;
    /**
     * The `password_hash` for the user's password.
     *
     * Allows you to specify a password hash for the user. This is useful for migrating a user's password hash from another service.
     *
     * Supports bcrypt, scrypt (firebase), and argon2 password hashes.
     */
    password_hash?: string;
    /**
     * The `id` for the user.
     *
     * Allows you to overwrite the default `id` set for the user.
     */
    id?: string;
}
interface Subscription {
    /**
     * The subscriber UUID. This will be set by the client.
     */
    id: string;
    /**
     * The function to call every time there is an event. eg: (eventName) => {}
     */
    callback: (event: AuthChangeEvent, session: Session | null) => void;
    /**
     * Call this to remove the listener.
     */
    unsubscribe: () => void;
}
declare type SignInAnonymouslyCredentials = {
    options?: {
        /**
         * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
         *
         * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
         */
        data?: object;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type SignUpWithPasswordCredentials = {
    /** The user's email address. */
    email: string;
    /** The user's password. */
    password: string;
    options?: {
        /** The redirect url embedded in the email link */
        emailRedirectTo?: string;
        /**
         * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
         *
         * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
         */
        data?: object;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
} | {
    /** The user's phone number. */
    phone: string;
    /** The user's password. */
    password: string;
    options?: {
        /**
         * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
         *
         * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
         */
        data?: object;
        /** Verification token received when the user completes the captcha on the site. Requires a configured WhatsApp sender on Twilio */
        captchaToken?: string;
        /** Messaging channel to use (e.g. whatsapp or sms) */
        channel?: 'sms' | 'whatsapp';
    };
};
declare type SignInWithPasswordCredentials = {
    /** The user's email address. */
    email: string;
    /** The user's password. */
    password: string;
    options?: {
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
} | {
    /** The user's phone number. */
    phone: string;
    /** The user's password. */
    password: string;
    options?: {
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type SignInWithPasswordlessCredentials = {
    /** The user's email address. */
    email: string;
    options?: {
        /** The redirect url embedded in the email link */
        emailRedirectTo?: string;
        /** If set to false, this method will not create a new user. Defaults to true. */
        shouldCreateUser?: boolean;
        /**
         * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
         *
         * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
         */
        data?: object;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
} | {
    /** The user's phone number. */
    phone: string;
    options?: {
        /** If set to false, this method will not create a new user. Defaults to true. */
        shouldCreateUser?: boolean;
        /**
         * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
         *
         * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
         */
        data?: object;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
        /** Messaging channel to use (e.g. whatsapp or sms) */
        channel?: 'sms' | 'whatsapp';
    };
};
declare type AuthFlowType = 'implicit' | 'pkce';
declare type SignInWithOAuthCredentials = {
    /** One of the providers supported by GoTrue. */
    provider: Provider;
    options?: {
        /** A URL to send the user to after they are confirmed. */
        redirectTo?: string;
        /** A space-separated list of scopes granted to the OAuth application. */
        scopes?: string;
        /** An object of query params */
        queryParams?: {
            [key: string]: string;
        };
        /** If set to true does not immediately redirect the current browser context to visit the OAuth authorization page for the provider. */
        skipBrowserRedirect?: boolean;
    };
};
declare type SignInWithIdTokenCredentials = {
    /** Provider name or OIDC `iss` value identifying which provider should be used to verify the provided token. Supported names: `google`, `apple`, `azure`, `facebook`, `kakao`, `keycloak` (deprecated). */
    provider: 'google' | 'apple' | 'azure' | 'facebook' | 'kakao' | (string & {});
    /** OIDC ID token issued by the specified provider. The `iss` claim in the ID token must match the supplied provider. Some ID tokens contain an `at_hash` which require that you provide an `access_token` value to be accepted properly. If the token contains a `nonce` claim you must supply the nonce used to obtain the ID token. */
    token: string;
    /** If the ID token contains an `at_hash` claim, then the hash of this value is compared to the value in the ID token. */
    access_token?: string;
    /** If the ID token contains a `nonce` claim, then the hash of this value is compared to the value in the ID token. */
    nonce?: string;
    options?: {
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type SolanaWallet = {
    signIn?: (...inputs: SolanaSignInInput[]) => Promise<SolanaSignInOutput | SolanaSignInOutput[]>;
    publicKey?: {
        toBase58: () => string;
    } | null;
    signMessage?: (message: Uint8Array, encoding?: 'utf8' | string) => Promise<Uint8Array> | undefined;
};
declare type SolanaWeb3Credentials = {
    chain: 'solana';
    /** Wallet interface to use. If not specified will default to `window.solana`. */
    wallet?: SolanaWallet;
    /** Optional statement to include in the Sign in with Solana message. Must not include new line characters. Most wallets like Phantom **require specifying a statement!** */
    statement?: string;
    options?: {
        /** URL to use with the wallet interface. Some wallets do not allow signing a message for URLs different from the current page. */
        url?: string;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
        signInWithSolana?: Partial<Omit<SolanaSignInInput, 'version' | 'chain' | 'domain' | 'uri' | 'statement'>>;
    };
} | {
    chain: 'solana';
    /** Sign in with Solana compatible message. Must include `Issued At`, `URI` and `Version`. */
    message: string;
    /** Ed25519 signature of the message. */
    signature: Uint8Array;
    options?: {
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type EthereumWallet = EIP1193Provider;
declare type EthereumWeb3Credentials = {
    chain: 'ethereum';
    /** Wallet interface to use. If not specified will default to `window.ethereum`. */
    wallet?: EthereumWallet;
    /** Optional statement to include in the Sign in with Ethereum message. Must not include new line characters. Most wallets like Phantom **require specifying a statement!** */
    statement?: string;
    options?: {
        /** URL to use with the wallet interface. Some wallets do not allow signing a message for URLs different from the current page. */
        url?: string;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
        signInWithEthereum?: Partial<Omit<EthereumSignInInput, 'version' | 'domain' | 'uri' | 'statement'>>;
    };
} | {
    chain: 'ethereum';
    /** Sign in with Ethereum compatible message. Must include `Issued At`, `URI` and `Version`. */
    message: string;
    /** Ethereum curve (secp256k1) signature of the message. */
    signature: Hex;
    options?: {
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type Web3Credentials = SolanaWeb3Credentials | EthereumWeb3Credentials;
declare type VerifyOtpParams = VerifyMobileOtpParams | VerifyEmailOtpParams | VerifyTokenHashParams;
interface VerifyMobileOtpParams {
    /** The user's phone number. */
    phone: string;
    /** The otp sent to the user's phone number. */
    token: string;
    /** The user's verification type. */
    type: MobileOtpType;
    options?: {
        /** A URL to send the user to after they are confirmed. */
        redirectTo?: string;
        /**
         * Verification token received when the user completes the captcha on the site.
         *
         * @deprecated
         */
        captchaToken?: string;
    };
}
interface VerifyEmailOtpParams {
    /** The user's email address. */
    email: string;
    /** The otp sent to the user's email address. */
    token: string;
    /** The user's verification type. */
    type: EmailOtpType;
    options?: {
        /** A URL to send the user to after they are confirmed. */
        redirectTo?: string;
        /** Verification token received when the user completes the captcha on the site.
         *
         * @deprecated
         */
        captchaToken?: string;
    };
}
interface VerifyTokenHashParams {
    /** The token hash used in an email link */
    token_hash: string;
    /** The user's verification type. */
    type: EmailOtpType;
}
declare type MobileOtpType = 'sms' | 'phone_change';
declare type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email';
declare type ResendParams = {
    type: Extract<EmailOtpType, 'signup' | 'email_change'>;
    email: string;
    options?: {
        /** A URL to send the user to after they have signed-in. */
        emailRedirectTo?: string;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
} | {
    type: Extract<MobileOtpType, 'sms' | 'phone_change'>;
    phone: string;
    options?: {
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type SignInWithSSO = {
    /** UUID of the SSO provider to invoke single-sign on to. */
    providerId: string;
    options?: {
        /** A URL to send the user to after they have signed-in. */
        redirectTo?: string;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
} | {
    /** Domain name of the organization for which to invoke single-sign on. */
    domain: string;
    options?: {
        /** A URL to send the user to after they have signed-in. */
        redirectTo?: string;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
declare type GenerateSignupLinkParams = {
    type: 'signup';
    email: string;
    password: string;
    options?: Pick<GenerateLinkOptions, 'data' | 'redirectTo'>;
};
declare type GenerateInviteOrMagiclinkParams = {
    type: 'invite' | 'magiclink';
    /** The user's email */
    email: string;
    options?: Pick<GenerateLinkOptions, 'data' | 'redirectTo'>;
};
declare type GenerateRecoveryLinkParams = {
    type: 'recovery';
    /** The user's email */
    email: string;
    options?: Pick<GenerateLinkOptions, 'redirectTo'>;
};
declare type GenerateEmailChangeLinkParams = {
    type: 'email_change_current' | 'email_change_new';
    /** The user's email */
    email: string;
    /**
     * The user's new email. Only required if type is 'email_change_current' or 'email_change_new'.
     */
    newEmail: string;
    options?: Pick<GenerateLinkOptions, 'redirectTo'>;
};
interface GenerateLinkOptions {
    /**
     * A custom data object to store the user's metadata. This maps to the `auth.users.raw_user_meta_data` column.
     *
     * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
     */
    data?: object;
    /** The URL which will be appended to the email link generated. */
    redirectTo?: string;
}
declare type GenerateLinkParams = GenerateSignupLinkParams | GenerateInviteOrMagiclinkParams | GenerateRecoveryLinkParams | GenerateEmailChangeLinkParams;
declare type GenerateLinkResponse = {
    data: {
        properties: GenerateLinkProperties;
        user: User;
    };
    error: null;
} | {
    data: {
        properties: null;
        user: null;
    };
    error: AuthError;
};
/** The properties related to the email link generated  */
declare type GenerateLinkProperties = {
    /**
     * The email link to send to the user.
     * The action_link follows the following format: auth/v1/verify?type={verification_type}&token={hashed_token}&redirect_to={redirect_to}
     * */
    action_link: string;
    /**
     * The raw email OTP.
     * You should send this in the email if you want your users to verify using an OTP instead of the action link.
     * */
    email_otp: string;
    /**
     * The hashed token appended to the action link.
     * */
    hashed_token: string;
    /** The URL appended to the action link. */
    redirect_to: string;
    /** The verification type that the email link is associated to. */
    verification_type: GenerateLinkType;
};
declare type GenerateLinkType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change_current' | 'email_change_new';
declare type MFAEnrollParams = MFAEnrollTOTPParams | MFAEnrollPhoneParams;
declare type MFAUnenrollParams = {
    /** ID of the factor being unenrolled. */
    factorId: string;
};
declare type MFAVerifyParams = {
    /** ID of the factor being verified. Returned in enroll(). */
    factorId: string;
    /** ID of the challenge being verified. Returned in challenge(). */
    challengeId: string;
    /** Verification code provided by the user. */
    code: string;
};
declare type MFAChallengeParams = {
    /** ID of the factor to be challenged. Returned in enroll(). */
    factorId: string;
    /** Messaging channel to use (e.g. whatsapp or sms). Only relevant for phone factors */
    channel?: 'sms' | 'whatsapp';
};
declare type MFAChallengeAndVerifyParams = {
    /** ID of the factor being verified. Returned in enroll(). */
    factorId: string;
    /** Verification code provided by the user. */
    code: string;
};
declare type AuthMFAVerifyResponse = {
    data: {
        /** New access token (JWT) after successful verification. */
        access_token: string;
        /** Type of token, typically `Bearer`. */
        token_type: string;
        /** Number of seconds in which the access token will expire. */
        expires_in: number;
        /** Refresh token you can use to obtain new access tokens when expired. */
        refresh_token: string;
        /** Updated user profile. */
        user: User;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type AuthMFAEnrollResponse = AuthMFAEnrollTOTPResponse | AuthMFAEnrollPhoneResponse;
declare type AuthMFAUnenrollResponse = {
    data: {
        /** ID of the factor that was successfully unenrolled. */
        id: string;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type AuthMFAChallengeResponse = {
    data: {
        /** ID of the newly created challenge. */
        id: string;
        /** Factor Type which generated the challenge */
        type: 'totp' | 'phone';
        /** Timestamp in UNIX seconds when this challenge will no longer be usable. */
        expires_at: number;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type AuthMFAListFactorsResponse = {
    data: {
        /** All available factors (verified and unverified). */
        all: Factor[];
        /** Only verified TOTP factors. (A subset of `all`.) */
        totp: Factor[];
        /** Only verified Phone factors. (A subset of `all`.) */
        phone: Factor[];
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type AuthenticatorAssuranceLevels = 'aal1' | 'aal2';
declare type AuthMFAGetAuthenticatorAssuranceLevelResponse = {
    data: {
        /** Current AAL level of the session. */
        currentLevel: AuthenticatorAssuranceLevels | null;
        /**
         * Next possible AAL level for the session. If the next level is higher
         * than the current one, the user should go through MFA.
         *
         * @see {@link GoTrueMFAApi#challenge}
         */
        nextLevel: AuthenticatorAssuranceLevels | null;
        /**
         * A list of all authentication methods attached to this session. Use
         * the information here to detect the last time a user verified a
         * factor, for example if implementing a step-up scenario.
         */
        currentAuthenticationMethods: AMREntry[];
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
/**
 * Contains the full multi-factor authentication API.
 *
 */
interface GoTrueMFAApi {
    /**
     * Starts the enrollment process for a new Multi-Factor Authentication (MFA)
     * factor. This method creates a new `unverified` factor.
     * To verify a factor, present the QR code or secret to the user and ask them to add it to their
     * authenticator app.
     * The user has to enter the code from their authenticator app to verify it.
     *
     * Upon verifying a factor, all other sessions are logged out and the current session's authenticator level is promoted to `aal2`.
     *
     */
    enroll(params: MFAEnrollTOTPParams): Promise<AuthMFAEnrollTOTPResponse>;
    enroll(params: MFAEnrollPhoneParams): Promise<AuthMFAEnrollPhoneResponse>;
    enroll(params: MFAEnrollParams): Promise<AuthMFAEnrollResponse>;
    /**
     * Prepares a challenge used to verify that a user has access to a MFA
     * factor.
     */
    challenge(params: MFAChallengeParams): Promise<AuthMFAChallengeResponse>;
    /**
     * Verifies a code against a challenge. The verification code is
     * provided by the user by entering a code seen in their authenticator app.
     */
    verify(params: MFAVerifyParams): Promise<AuthMFAVerifyResponse>;
    /**
     * Unenroll removes a MFA factor.
     * A user has to have an `aal2` authenticator level in order to unenroll a `verified` factor.
     */
    unenroll(params: MFAUnenrollParams): Promise<AuthMFAUnenrollResponse>;
    /**
     * Helper method which creates a challenge and immediately uses the given code to verify against it thereafter. The verification code is
     * provided by the user by entering a code seen in their authenticator app.
     */
    challengeAndVerify(params: MFAChallengeAndVerifyParams): Promise<AuthMFAVerifyResponse>;
    /**
     * Returns the list of MFA factors enabled for this user.
     *
     * @see {@link GoTrueMFAApi#enroll}
     * @see {@link GoTrueMFAApi#getAuthenticatorAssuranceLevel}
     * @see {@link GoTrueClient#getUser}
     *
     */
    listFactors(): Promise<AuthMFAListFactorsResponse>;
    /**
     * Returns the Authenticator Assurance Level (AAL) for the active session.
     *
     * - `aal1` (or `null`) means that the user's identity has been verified only
     * with a conventional login (email+password, OTP, magic link, social login,
     * etc.).
     * - `aal2` means that the user's identity has been verified both with a conventional login and at least one MFA factor.
     *
     * Although this method returns a promise, it's fairly quick (microseconds)
     * and rarely uses the network. You can use this to check whether the current
     * user needs to be shown a screen to verify their MFA factors.
     *
     */
    getAuthenticatorAssuranceLevel(): Promise<AuthMFAGetAuthenticatorAssuranceLevelResponse>;
}
/**
 * @expermental
 */
declare type AuthMFAAdminDeleteFactorResponse = {
    data: {
        /** ID of the factor that was successfully deleted. */
        id: string;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
/**
 * @expermental
 */
declare type AuthMFAAdminDeleteFactorParams = {
    /** ID of the MFA factor to delete. */
    id: string;
    /** ID of the user whose factor is being deleted. */
    userId: string;
};
/**
 * @expermental
 */
declare type AuthMFAAdminListFactorsResponse = {
    data: {
        /** All factors attached to the user. */
        factors: Factor[];
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
/**
 * @expermental
 */
declare type AuthMFAAdminListFactorsParams = {
    /** ID of the user. */
    userId: string;
};
/**
 * Contains the full multi-factor authentication administration API.
 *
 * @expermental
 */
interface GoTrueAdminMFAApi {
    /**
     * Lists all factors associated to a user.
     *
     */
    listFactors(params: AuthMFAAdminListFactorsParams): Promise<AuthMFAAdminListFactorsResponse>;
    /**
     * Deletes a factor on a user. This will log the user out of all active
     * sessions if the deleted factor was verified.
     *
     * @see {@link GoTrueMFAApi#unenroll}
     *
     * @expermental
     */
    deleteFactor(params: AuthMFAAdminDeleteFactorParams): Promise<AuthMFAAdminDeleteFactorResponse>;
}
declare type AnyFunction = (...args: any[]) => any;
declare type MaybePromisify<T> = T | Promise<T>;
declare type PromisifyMethods<T> = {
    [K in keyof T]: T[K] extends AnyFunction ? (...args: Parameters<T[K]>) => MaybePromisify<ReturnType<T[K]>> : T[K];
};
declare type SupportedStorage = PromisifyMethods<Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>> & {
    /**
     * If set to `true` signals to the library that the storage medium is used
     * on a server and the values may not be authentic, such as reading from
     * request cookies. Implementations should not set this to true if the client
     * is used on a server that reads storage information from authenticated
     * sources, such as a secure database or file.
     */
    isServer?: boolean;
};
declare type InitializeResult = {
    error: AuthError | null;
};
declare type CallRefreshTokenResult = {
    session: Session;
    error: null;
} | {
    session: null;
    error: AuthError;
};
declare type Pagination = {
    [key: string]: any;
    nextPage: number | null;
    lastPage: number;
    total: number;
};
declare type PageParams = {
    /** The page number */
    page?: number;
    /** Number of items returned per page */
    perPage?: number;
};
declare type SignOut = {
    /**
     * Determines which sessions should be
     * logged out. Global means all
     * sessions by this account. Local
     * means only this session. Others
     * means all other sessions except the
     * current one. When using others,
     * there is no sign-out event fired on
     * the current session!
     */
    scope?: 'global' | 'local' | 'others';
};
declare type MFAEnrollTOTPParams = {
    /** The type of factor being enrolled. */
    factorType: 'totp';
    /** Domain which the user is enrolled with. */
    issuer?: string;
    /** Human readable name assigned to the factor. */
    friendlyName?: string;
};
declare type MFAEnrollPhoneParams = {
    /** The type of factor being enrolled. */
    factorType: 'phone';
    /** Human readable name assigned to the factor. */
    friendlyName?: string;
    /** Phone number associated with a factor. Number should conform to E.164 format */
    phone: string;
};
declare type AuthMFAEnrollTOTPResponse = {
    data: {
        /** ID of the factor that was just enrolled (in an unverified state). */
        id: string;
        /** Type of MFA factor.*/
        type: 'totp';
        /** TOTP enrollment information. */
        totp: {
            /** Contains a QR code encoding the authenticator URI. You can
             * convert it to a URL by prepending `data:image/svg+xml;utf-8,` to
             * the value. Avoid logging this value to the console. */
            qr_code: string;
            /** The TOTP secret (also encoded in the QR code). Show this secret
             * in a password-style field to the user, in case they are unable to
             * scan the QR code. Avoid logging this value to the console. */
            secret: string;
            /** The authenticator URI encoded within the QR code, should you need
             * to use it. Avoid loggin this value to the console. */
            uri: string;
        };
        /** Friendly name of the factor, useful for distinguishing between factors **/
        friendly_name?: string;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type AuthMFAEnrollPhoneResponse = {
    data: {
        /** ID of the factor that was just enrolled (in an unverified state). */
        id: string;
        /** Type of MFA factor. */
        type: 'phone';
        /** Friendly name of the factor, useful for distinguishing between factors **/
        friendly_name?: string;
        /** Phone number of the MFA factor in E.164 format. Used to send messages  */
        phone: string;
    };
    error: null;
} | {
    data: null;
    error: AuthError;
};
declare type JwtHeader = {
    alg: 'RS256' | 'ES256' | 'HS256';
    kid: string;
    typ: string;
};
declare type RequiredClaims = {
    iss: string;
    sub: string;
    aud: string | string[];
    exp: number;
    iat: number;
    role: string;
    aal: AuthenticatorAssuranceLevels;
    session_id: string;
};
declare type JwtPayload = RequiredClaims & {
    [key: string]: any;
};
interface JWK {
    kty: 'RSA' | 'EC' | 'oct';
    key_ops: string[];
    alg?: string;
    kid?: string;
    [key: string]: any;
}
declare const SIGN_OUT_SCOPES: readonly ["global", "local", "others"];
declare type SignOutScope = typeof SIGN_OUT_SCOPES[number];

declare type Fetch$5 = typeof fetch;

declare class GoTrueAdminApi {
    /** Contains all MFA administration methods. */
    mfa: GoTrueAdminMFAApi;
    protected url: string;
    protected headers: {
        [key: string]: string;
    };
    protected fetch: Fetch$5;
    constructor({ url, headers, fetch, }: {
        url: string;
        headers?: {
            [key: string]: string;
        };
        fetch?: Fetch$5;
    });
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     * @param scope The logout sope.
     */
    signOut(jwt: string, scope?: SignOutScope): Promise<{
        data: null;
        error: AuthError | null;
    }>;
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param options Additional options to be included when inviting.
     */
    inviteUserByEmail(email: string, options?: {
        /** A custom data object to store additional metadata about the user. This maps to the `auth.users.user_metadata` column. */
        data?: object;
        /** The URL which will be appended to the email link sent to the user's email address. Once clicked the user will end up on this URL. */
        redirectTo?: string;
    }): Promise<UserResponse>;
    /**
     * Generates email links and OTPs to be sent via a custom email provider.
     * @param email The user's email.
     * @param options.password User password. For signup only.
     * @param options.data Optional user metadata. For signup only.
     * @param options.redirectTo The redirect url which should be appended to the generated link
     */
    generateLink(params: GenerateLinkParams): Promise<GenerateLinkResponse>;
    /**
     * Creates a new user.
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    createUser(attributes: AdminUserAttributes): Promise<UserResponse>;
    /**
     * Get a list of users.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
     */
    listUsers(params?: PageParams): Promise<{
        data: {
            users: User[];
            aud: string;
        } & Pagination;
        error: null;
    } | {
        data: {
            users: [];
        };
        error: AuthError;
    }>;
    /**
     * Get user by id.
     *
     * @param uid The user's unique identifier
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    getUserById(uid: string): Promise<UserResponse>;
    /**
     * Updates the user data.
     *
     * @param attributes The data you want to update.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    updateUserById(uid: string, attributes: AdminUserAttributes): Promise<UserResponse>;
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * @param id The user id you want to remove.
     * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
     * Defaults to false for backward compatibility.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    deleteUser(id: string, shouldSoftDelete?: boolean): Promise<UserResponse>;
    private _listFactors;
    private _deleteFactor;
}

/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
 */
declare class Deferred<T = any> {
    static promiseConstructor: PromiseConstructor;
    readonly promise: PromiseLike<T>;
    readonly resolve: (value?: T | PromiseLike<T>) => void;
    readonly reject: (reason?: any) => any;
    constructor();
}

declare class GoTrueClient {
    private static nextInstanceID;
    private instanceID;
    /**
     * Namespace for the GoTrue admin methods.
     * These methods should only be used in a trusted server-side environment.
     */
    admin: GoTrueAdminApi;
    /**
     * Namespace for the MFA methods.
     */
    mfa: GoTrueMFAApi;
    /**
     * The storage key used to identify the values saved in localStorage
     */
    protected storageKey: string;
    protected flowType: AuthFlowType;
    /**
     * The JWKS used for verifying asymmetric JWTs
     */
    protected get jwks(): {
        keys: JWK[];
    };
    protected set jwks(value: {
        keys: JWK[];
    });
    protected get jwks_cached_at(): number;
    protected set jwks_cached_at(value: number);
    protected autoRefreshToken: boolean;
    protected persistSession: boolean;
    protected storage: SupportedStorage;
    /**
     * @experimental
     */
    protected userStorage: SupportedStorage | null;
    protected memoryStorage: {
        [key: string]: string;
    } | null;
    protected stateChangeEmitters: Map<string, Subscription>;
    protected autoRefreshTicker: ReturnType<typeof setInterval> | null;
    protected visibilityChangedCallback: (() => Promise<any>) | null;
    protected refreshingDeferred: Deferred<CallRefreshTokenResult> | null;
    /**
     * Keeps track of the async client initialization.
     * When null or not yet resolved the auth state is `unknown`
     * Once resolved the auth state is known and it's safe to call any further client methods.
     * Keep extra care to never reject or throw uncaught errors
     */
    protected initializePromise: Promise<InitializeResult> | null;
    protected detectSessionInUrl: boolean;
    protected url: string;
    protected headers: {
        [key: string]: string;
    };
    protected hasCustomAuthorizationHeader: boolean;
    protected suppressGetSessionWarning: boolean;
    protected fetch: Fetch$5;
    protected lock: LockFunc;
    protected lockAcquired: boolean;
    protected pendingInLock: Promise<any>[];
    /**
     * Used to broadcast state change events to other tabs listening.
     */
    protected broadcastChannel: BroadcastChannel | null;
    protected logDebugMessages: boolean;
    protected logger: (message: string, ...args: any[]) => void;
    /**
     * Create a new client for use in the browser.
     */
    constructor(options: GoTrueClientOptions);
    private _debug;
    /**
     * Initializes the client session either from the url or from storage.
     * This method is automatically called when instantiating the client, but should also be called
     * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
     */
    initialize(): Promise<InitializeResult>;
    /**
     * IMPORTANT:
     * 1. Never throw in this method, as it is called from the constructor
     * 2. Never return a session from this method as it would be cached over
     *    the whole lifetime of the client
     */
    private _initialize;
    /**
     * Creates a new anonymous user.
     *
     * @returns A session where the is_anonymous claim in the access token JWT set to true
     */
    signInAnonymously(credentials?: SignInAnonymouslyCredentials): Promise<AuthResponse>;
    /**
     * Creates a new user.
     *
     * Be aware that if a user account exists in the system you may get back an
     * error message that attempts to hide this information from the user.
     * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    signUp(credentials: SignUpWithPasswordCredentials): Promise<AuthResponse>;
    /**
     * Log in an existing user with an email and password or phone and password.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or that the
     * email/phone and password combination is wrong or that the account can only
     * be accessed via social login.
     */
    signInWithPassword(credentials: SignInWithPasswordCredentials): Promise<AuthTokenResponsePassword>;
    /**
     * Log in an existing user via a third-party provider.
     * This method supports the PKCE flow.
     */
    signInWithOAuth(credentials: SignInWithOAuthCredentials): Promise<OAuthResponse>;
    /**
     * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
     */
    exchangeCodeForSession(authCode: string): Promise<AuthTokenResponse>;
    /**
     * Signs in a user by verifying a message signed by the user's private key.
     * Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
     * both of which derive from the EIP-4361 standard
     * With slight variation on Solana's side.
     * @reference https://eips.ethereum.org/EIPS/eip-4361
     */
    signInWithWeb3(credentials: Web3Credentials): Promise<{
        data: {
            session: Session;
            user: User;
        };
        error: null;
    } | {
        data: {
            session: null;
            user: null;
        };
        error: AuthError;
    }>;
    private signInWithEthereum;
    private signInWithSolana;
    private _exchangeCodeForSession;
    /**
     * Allows signing in with an OIDC ID token. The authentication provider used
     * should be enabled and configured.
     */
    signInWithIdToken(credentials: SignInWithIdTokenCredentials): Promise<AuthTokenResponse>;
    /**
     * Log in a user using magiclink or a one-time password (OTP).
     *
     * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
     * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
     * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or, that the account
     * can only be accessed via social login.
     *
     * Do note that you will need to configure a Whatsapp sender on Twilio
     * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
     * channel is not supported on other providers
     * at this time.
     * This method supports PKCE when an email is passed.
     */
    signInWithOtp(credentials: SignInWithPasswordlessCredentials): Promise<AuthOtpResponse>;
    /**
     * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
     */
    verifyOtp(params: VerifyOtpParams): Promise<AuthResponse>;
    /**
     * Attempts a single-sign on using an enterprise Identity Provider. A
     * successful SSO attempt will redirect the current page to the identity
     * provider authorization page. The redirect URL is implementation and SSO
     * protocol specific.
     *
     * You can use it by providing a SSO domain. Typically you can extract this
     * domain by asking users for their email address. If this domain is
     * registered on the Auth instance the redirect will use that organization's
     * currently active SSO Identity Provider for the login.
     *
     * If you have built an organization-specific login page, you can use the
     * organization's SSO Identity Provider UUID directly instead.
     */
    signInWithSSO(params: SignInWithSSO): Promise<SSOResponse>;
    /**
     * Sends a reauthentication OTP to the user's email or phone number.
     * Requires the user to be signed-in.
     */
    reauthenticate(): Promise<AuthResponse>;
    private _reauthenticate;
    /**
     * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
     */
    resend(credentials: ResendParams): Promise<AuthOtpResponse>;
    /**
     * Returns the session, refreshing it if necessary.
     *
     * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
     *
     * **IMPORTANT:** This method loads values directly from the storage attached
     * to the client. If that storage is based on request cookies for example,
     * the values in it may not be authentic and therefore it's strongly advised
     * against using this method and its results in such circumstances. A warning
     * will be emitted if this is detected. Use {@link #getUser()} instead.
     */
    getSession(): Promise<{
        data: {
            session: Session;
        };
        error: null;
    } | {
        data: {
            session: null;
        };
        error: AuthError;
    } | {
        data: {
            session: null;
        };
        error: null;
    }>;
    /**
     * Acquires a global lock based on the storage key.
     */
    private _acquireLock;
    /**
     * Use instead of {@link #getSession} inside the library. It is
     * semantically usually what you want, as getting a session involves some
     * processing afterwards that requires only one client operating on the
     * session at once across multiple tabs or processes.
     */
    private _useSession;
    /**
     * NEVER USE DIRECTLY!
     *
     * Always use {@link #_useSession}.
     */
    private __loadSession;
    /**
     * Gets the current user details if there is an existing session. This method
     * performs a network request to the Supabase Auth server, so the returned
     * value is authentic and can be used to base authorization rules on.
     *
     * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
     */
    getUser(jwt?: string): Promise<UserResponse>;
    private _getUser;
    /**
     * Updates user data for a logged in user.
     */
    updateUser(attributes: UserAttributes, options?: {
        emailRedirectTo?: string | undefined;
    }): Promise<UserResponse>;
    protected _updateUser(attributes: UserAttributes, options?: {
        emailRedirectTo?: string | undefined;
    }): Promise<UserResponse>;
    /**
     * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
     * If the refresh token or access token in the current session is invalid, an error will be thrown.
     * @param currentSession The current session that minimally contains an access token and refresh token.
     */
    setSession(currentSession: {
        access_token: string;
        refresh_token: string;
    }): Promise<AuthResponse>;
    protected _setSession(currentSession: {
        access_token: string;
        refresh_token: string;
    }): Promise<AuthResponse>;
    /**
     * Returns a new session, regardless of expiry status.
     * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
     * If the current session's refresh token is invalid, an error will be thrown.
     * @param currentSession The current session. If passed in, it must contain a refresh token.
     */
    refreshSession(currentSession?: {
        refresh_token: string;
    }): Promise<AuthResponse>;
    protected _refreshSession(currentSession?: {
        refresh_token: string;
    }): Promise<AuthResponse>;
    /**
     * Gets the session data from a URL string
     */
    private _getSessionFromURL;
    /**
     * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
     */
    private _isImplicitGrantCallback;
    /**
     * Checks if the current URL and backing storage contain parameters given by a PKCE flow
     */
    private _isPKCECallback;
    /**
     * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
     *
     * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
     * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
     *
     * If using `others` scope, no `SIGNED_OUT` event is fired!
     */
    signOut(options?: SignOut): Promise<{
        error: AuthError | null;
    }>;
    protected _signOut({ scope }?: SignOut): Promise<{
        error: AuthError | null;
    }>;
    /**
     * Receive a notification every time an auth event happens.
     * @param callback A callback function to be invoked when an auth event happens.
     */
    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>): {
        data: {
            subscription: Subscription;
        };
    };
    private _emitInitialSession;
    /**
     * Sends a password reset request to an email address. This method supports the PKCE flow.
     *
     * @param email The email address of the user.
     * @param options.redirectTo The URL to send the user to after they click the password reset link.
     * @param options.captchaToken Verification token received when the user completes the captcha on the site.
     */
    resetPasswordForEmail(email: string, options?: {
        redirectTo?: string;
        captchaToken?: string;
    }): Promise<{
        data: {};
        error: null;
    } | {
        data: null;
        error: AuthError;
    }>;
    /**
     * Gets all the identities linked to a user.
     */
    getUserIdentities(): Promise<{
        data: {
            identities: UserIdentity[];
        };
        error: null;
    } | {
        data: null;
        error: AuthError;
    }>;
    /**
     * Links an oauth identity to an existing user.
     * This method supports the PKCE flow.
     */
    linkIdentity(credentials: SignInWithOAuthCredentials): Promise<OAuthResponse>;
    /**
     * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
     */
    unlinkIdentity(identity: UserIdentity): Promise<{
        data: {};
        error: null;
    } | {
        data: null;
        error: AuthError;
    }>;
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    private _refreshAccessToken;
    private _isValidSession;
    private _handleProviderSignIn;
    /**
     * Recovers the session from LocalStorage and refreshes the token
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    private _recoverAndRefresh;
    private _callRefreshToken;
    private _notifyAllSubscribers;
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    private _saveSession;
    private _removeSession;
    /**
     * Removes any registered visibilitychange callback.
     *
     * {@see #startAutoRefresh}
     * {@see #stopAutoRefresh}
     */
    private _removeVisibilityChangedCallback;
    /**
     * This is the private implementation of {@link #startAutoRefresh}. Use this
     * within the library.
     */
    private _startAutoRefresh;
    /**
     * This is the private implementation of {@link #stopAutoRefresh}. Use this
     * within the library.
     */
    private _stopAutoRefresh;
    /**
     * Starts an auto-refresh process in the background. The session is checked
     * every few seconds. Close to the time of expiration a process is started to
     * refresh the session. If refreshing fails it will be retried for as long as
     * necessary.
     *
     * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
     * to call this function, it will be called for you.
     *
     * On browsers the refresh process works only when the tab/window is in the
     * foreground to conserve resources as well as prevent race conditions and
     * flooding auth with requests. If you call this method any managed
     * visibility change callback will be removed and you must manage visibility
     * changes on your own.
     *
     * On non-browser platforms the refresh process works *continuously* in the
     * background, which may not be desirable. You should hook into your
     * platform's foreground indication mechanism and call these methods
     * appropriately to conserve resources.
     *
     * {@see #stopAutoRefresh}
     */
    startAutoRefresh(): Promise<void>;
    /**
     * Stops an active auto refresh process running in the background (if any).
     *
     * If you call this method any managed visibility change callback will be
     * removed and you must manage visibility changes on your own.
     *
     * See {@link #startAutoRefresh} for more details.
     */
    stopAutoRefresh(): Promise<void>;
    /**
     * Runs the auto refresh token tick.
     */
    private _autoRefreshTokenTick;
    /**
     * Registers callbacks on the browser / platform, which in-turn run
     * algorithms when the browser window/tab are in foreground. On non-browser
     * platforms it assumes always foreground.
     */
    private _handleVisibilityChange;
    /**
     * Callback registered with `window.addEventListener('visibilitychange')`.
     */
    private _onVisibilityChanged;
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param options.scopes A space-separated list of scopes granted to the OAuth application.
     * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
     */
    private _getUrlForProvider;
    private _unenroll;
    /**
     * {@see GoTrueMFAApi#enroll}
     */
    private _enroll;
    /**
     * {@see GoTrueMFAApi#verify}
     */
    private _verify;
    /**
     * {@see GoTrueMFAApi#challenge}
     */
    private _challenge;
    /**
     * {@see GoTrueMFAApi#challengeAndVerify}
     */
    private _challengeAndVerify;
    /**
     * {@see GoTrueMFAApi#listFactors}
     */
    private _listFactors;
    /**
     * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
     */
    private _getAuthenticatorAssuranceLevel;
    private fetchJwk;
    /**
     * Extracts the JWT claims present in the access token by first verifying the
     * JWT against the server's JSON Web Key Set endpoint
     * `/.well-known/jwks.json` which is often cached, resulting in significantly
     * faster responses. Prefer this method over {@link #getUser} which always
     * sends a request to the Auth server for each JWT.
     *
     * If the project is not using an asymmetric JWT signing key (like ECC or
     * RSA) it always sends a request to the Auth server (similar to {@link
     * #getUser}) to verify the JWT.
     *
     * @param jwt An optional specific JWT you wish to verify, not the one you
     *            can obtain from {@link #getSession}.
     * @param options Various additional options that allow you to customize the
     *                behavior of this method.
     */
    getClaims(jwt?: string, options?: {
        /**
         * @deprecated Please use options.jwks instead.
         */
        keys?: JWK[];
        /** If set to `true` the `exp` claim will not be validated against the current time. */
        allowExpired?: boolean;
        /** If set, this JSON Web Key Set is going to have precedence over the cached value available on the server. */
        jwks?: {
            keys: JWK[];
        };
    }): Promise<{
        data: {
            claims: JwtPayload;
            header: JwtHeader;
            signature: Uint8Array;
        };
        error: null;
    } | {
        data: null;
        error: AuthError;
    } | {
        data: null;
        error: null;
    }>;
}

declare const AuthAdminApi: typeof GoTrueAdminApi;
//# sourceMappingURL=AuthAdminApi.d.ts.map

declare const AuthClient: typeof GoTrueClient;
//# sourceMappingURL=AuthClient.d.ts.map

/**
 * @experimental
 */
declare const internals: {
    /**
     * @experimental
     */
    debug: boolean;
};
/**
 * An error thrown when a lock cannot be acquired after some amount of time.
 *
 * Use the {@link #isAcquireTimeout} property instead of checking with `instanceof`.
 */
declare abstract class LockAcquireTimeoutError extends Error {
    readonly isAcquireTimeout = true;
    constructor(message: string);
}
declare class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
}
/**
 * Implements a global exclusive lock using the Navigator LockManager API. It
 * is available on all browsers released after 2022-03-15 with Safari being the
 * last one to release support. If the API is not available, this function will
 * throw. Make sure you check availablility before configuring {@link
 * GoTrueClient}.
 *
 * You can turn on debugging by setting the `supabase.gotrue-js.locks.debug`
 * local storage item to `true`.
 *
 * Internals:
 *
 * Since the LockManager API does not preserve stack traces for the async
 * function passed in the `request` method, a trick is used where acquiring the
 * lock releases a previously started promise to run the operation in the `fn`
 * function. The lock waits for that promise to finish (with or without error),
 * while the function will finally wait for the result anyway.
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout. If 0 an error is thrown if
 *                       the lock can't be acquired without waiting. If positive, the lock acquire
 *                       will time out after so many milliseconds. An error is
 *                       a timeout if it has `isAcquireTimeout` set to true.
 * @param fn The operation to run once the lock is acquired.
 */
declare function navigatorLock<R>(name: string, acquireTimeout: number, fn: () => Promise<R>): Promise<R>;
/**
 * Implements a global exclusive lock that works only in the current process.
 * Useful for environments like React Native or other non-browser
 * single-process (i.e. no concept of "tabs") environments.
 *
 * Use {@link #navigatorLock} in browser environments.
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout. If 0 an error is thrown if
 *                       the lock can't be acquired without waiting. If positive, the lock acquire
 *                       will time out after so many milliseconds. An error is
 *                       a timeout if it has `isAcquireTimeout` set to true.
 * @param fn The operation to run once the lock is acquired.
 */
declare function processLock<R>(name: string, acquireTimeout: number, fn: () => Promise<R>): Promise<R>;

interface WebSocketLike {
    readonly CONNECTING: number;
    readonly OPEN: number;
    readonly CLOSING: number;
    readonly CLOSED: number;
    readonly readyState: number;
    readonly url: string;
    readonly protocol: string;
    close(code?: number, reason?: string): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    onopen: ((this: any, ev: Event) => any) | null;
    onmessage: ((this: any, ev: MessageEvent) => any) | null;
    onclose: ((this: any, ev: CloseEvent) => any) | null;
    onerror: ((this: any, ev: Event) => any) | null;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
    binaryType?: string;
    bufferedAmount?: number;
    extensions?: string;
    dispatchEvent?: (event: Event) => boolean;
}
declare class WebSocketFactory {
    private static detectEnvironment;
    static getWebSocketConstructor(): typeof WebSocket;
    static createWebSocket(url: string | URL, protocols?: string | string[]): WebSocketLike;
    static isWebSocketSupported(): boolean;
}

declare enum CHANNEL_STATES {
    closed = "closed",
    errored = "errored",
    joined = "joined",
    joining = "joining",
    leaving = "leaving"
}
declare enum CONNECTION_STATE {
    Connecting = "connecting",
    Open = "open",
    Closing = "closing",
    Closed = "closed"
}

declare class Serializer {
    HEADER_LENGTH: number;
    decode(rawPayload: ArrayBuffer | string, callback: Function): any;
    private _binaryDecode;
    private _decodeBroadcast;
}

/**
 * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
 *
 * @example
 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *      return [1000, 5000, 10000][tries - 1] || 10000
 *    })
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 *    reconnectTimer.scheduleTimeout() // fires after 5000
 *    reconnectTimer.reset()
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 */
declare class Timer {
    callback: Function;
    timerCalc: Function;
    timer: number | undefined;
    tries: number;
    constructor(callback: Function, timerCalc: Function);
    reset(): void;
    scheduleTimeout(): void;
}

declare class Push$1 {
    channel: RealtimeChannel;
    event: string;
    payload: {
        [key: string]: any;
    };
    timeout: number;
    sent: boolean;
    timeoutTimer: number | undefined;
    ref: string;
    receivedResp: {
        status: string;
        response: {
            [key: string]: any;
        };
    } | null;
    recHooks: {
        status: string;
        callback: Function;
    }[];
    refEvent: string | null;
    /**
     * Initializes the Push
     *
     * @param channel The Channel
     * @param event The event, for example `"phx_join"`
     * @param payload The payload, for example `{user_id: 123}`
     * @param timeout The push timeout in milliseconds
     */
    constructor(channel: RealtimeChannel, event: string, payload?: {
        [key: string]: any;
    }, timeout?: number);
    resend(timeout: number): void;
    send(): void;
    updatePayload(payload: {
        [key: string]: any;
    }): void;
    receive(status: string, callback: Function): this;
    startTimeout(): void;
    trigger(status: string, response: any): void;
    destroy(): void;
    private _cancelRefEvent;
    private _cancelTimeout;
    private _matchReceive;
    private _hasReceived;
}

type PresenceOnJoinCallback = (key?: string, currentPresence?: any, newPresence?: any) => void;

type PresenceOnLeaveCallback = (key?: string, currentPresence?: any, newPresence?: any) => void;

interface PresenceOpts {
    events?: { state: string; diff: string } | undefined;
}

type Presence<T extends {
    [key: string]: any;
} = {}> = {
    presence_ref: string;
} & T;
type RealtimePresenceState<T extends {
    [key: string]: any;
} = {}> = {
    [key: string]: Presence<T>[];
};
type RealtimePresenceJoinPayload<T extends {
    [key: string]: any;
}> = {
    event: `${REALTIME_PRESENCE_LISTEN_EVENTS.JOIN}`;
    key: string;
    currentPresences: Presence<T>[];
    newPresences: Presence<T>[];
};
type RealtimePresenceLeavePayload<T extends {
    [key: string]: any;
}> = {
    event: `${REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE}`;
    key: string;
    currentPresences: Presence<T>[];
    leftPresences: Presence<T>[];
};
declare enum REALTIME_PRESENCE_LISTEN_EVENTS {
    SYNC = "sync",
    JOIN = "join",
    LEAVE = "leave"
}
type RawPresenceState = {
    [key: string]: {
        metas: {
            phx_ref?: string;
            phx_ref_prev?: string;
            [key: string]: any;
        }[];
    };
};
type RawPresenceDiff = {
    joins: RawPresenceState;
    leaves: RawPresenceState;
};
declare class RealtimePresence {
    channel: RealtimeChannel;
    state: RealtimePresenceState;
    pendingDiffs: RawPresenceDiff[];
    joinRef: string | null;
    enabled: boolean;
    caller: {
        onJoin: PresenceOnJoinCallback;
        onLeave: PresenceOnLeaveCallback;
        onSync: () => void;
    };
    /**
     * Initializes the Presence.
     *
     * @param channel - The RealtimeChannel
     * @param opts - The options,
     *        for example `{events: {state: 'state', diff: 'diff'}}`
     */
    constructor(channel: RealtimeChannel, opts?: PresenceOpts);
}

type RealtimeChannelOptions = {
    config: {
        /**
         * self option enables client to receive message it broadcast
         * ack option instructs server to acknowledge that broadcast message was received
         */
        broadcast?: {
            self?: boolean;
            ack?: boolean;
        };
        /**
         * key option is used to track presence payload across clients
         */
        presence?: {
            key?: string;
            enabled?: boolean;
        };
        /**
         * defines if the channel is private or not and if RLS policies will be used to check data
         */
        private?: boolean;
    };
};
type RealtimePostgresChangesPayloadBase = {
    schema: string;
    table: string;
    commit_timestamp: string;
    errors: string[];
};
type RealtimePostgresInsertPayload<T extends {
    [key: string]: any;
}> = RealtimePostgresChangesPayloadBase & {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`;
    new: T;
    old: {};
};
type RealtimePostgresUpdatePayload<T extends {
    [key: string]: any;
}> = RealtimePostgresChangesPayloadBase & {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE}`;
    new: T;
    old: Partial<T>;
};
type RealtimePostgresDeletePayload<T extends {
    [key: string]: any;
}> = RealtimePostgresChangesPayloadBase & {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE}`;
    new: {};
    old: Partial<T>;
};
type RealtimePostgresChangesPayload<T extends {
    [key: string]: any;
}> = RealtimePostgresInsertPayload<T> | RealtimePostgresUpdatePayload<T> | RealtimePostgresDeletePayload<T>;
type RealtimePostgresChangesFilter<T extends `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`> = {
    /**
     * The type of database change to listen to.
     */
    event: T;
    /**
     * The database schema to listen to.
     */
    schema: string;
    /**
     * The database table to listen to.
     */
    table?: string;
    /**
     * Receive database changes when filter is matched.
     */
    filter?: string;
};
type RealtimeChannelSendResponse = 'ok' | 'timed out' | 'error';
declare enum REALTIME_POSTGRES_CHANGES_LISTEN_EVENT {
    ALL = "*",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
declare enum REALTIME_LISTEN_TYPES {
    BROADCAST = "broadcast",
    PRESENCE = "presence",
    POSTGRES_CHANGES = "postgres_changes",
    SYSTEM = "system"
}
declare enum REALTIME_SUBSCRIBE_STATES {
    SUBSCRIBED = "SUBSCRIBED",
    TIMED_OUT = "TIMED_OUT",
    CLOSED = "CLOSED",
    CHANNEL_ERROR = "CHANNEL_ERROR"
}
declare const REALTIME_CHANNEL_STATES: typeof CHANNEL_STATES;
/** A channel is the basic building block of Realtime
 * and narrows the scope of data flow to subscribed clients.
 * You can think of a channel as a chatroom where participants are able to see who's online
 * and send and receive messages.
 */
declare class RealtimeChannel {
    /** Topic name can be any string. */
    topic: string;
    params: RealtimeChannelOptions;
    socket: RealtimeClient;
    bindings: {
        [key: string]: {
            type: string;
            filter: {
                [key: string]: any;
            };
            callback: Function;
            id?: string;
        }[];
    };
    timeout: number;
    state: CHANNEL_STATES;
    joinedOnce: boolean;
    joinPush: Push$1;
    rejoinTimer: Timer;
    pushBuffer: Push$1[];
    presence: RealtimePresence;
    broadcastEndpointURL: string;
    subTopic: string;
    private: boolean;
    constructor(
    /** Topic name can be any string. */
    topic: string, params: RealtimeChannelOptions | undefined, socket: RealtimeClient);
    /** Subscribe registers your client with the server */
    subscribe(callback?: (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void, timeout?: number): RealtimeChannel;
    presenceState<T extends {
        [key: string]: any;
    } = {}>(): RealtimePresenceState<T>;
    track(payload: {
        [key: string]: any;
    }, opts?: {
        [key: string]: any;
    }): Promise<RealtimeChannelSendResponse>;
    untrack(opts?: {
        [key: string]: any;
    }): Promise<RealtimeChannelSendResponse>;
    /**
     * Creates an event handler that listens to changes.
     */
    on(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: `${REALTIME_PRESENCE_LISTEN_EVENTS.SYNC}`;
    }, callback: () => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: `${REALTIME_PRESENCE_LISTEN_EVENTS.JOIN}`;
    }, callback: (payload: RealtimePresenceJoinPayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: `${REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE}`;
    }, callback: (payload: RealtimePresenceLeavePayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>, callback: (payload: RealtimePostgresChangesPayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`>, callback: (payload: RealtimePostgresInsertPayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE}`>, callback: (payload: RealtimePostgresUpdatePayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE}`>, callback: (payload: RealtimePostgresDeletePayload<T>) => void): RealtimeChannel;
    /**
     * The following is placed here to display on supabase.com/docs/reference/javascript/subscribe.
     * @param type One of "broadcast", "presence", or "postgres_changes".
     * @param filter Custom object specific to the Realtime feature detailing which payloads to receive.
     * @param callback Function to be invoked when event handler is triggered.
     */
    on(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: string;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: string;
        [key: string]: any;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: string;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: string;
        payload: T;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.SYSTEM}`, filter: {}, callback: (payload: any) => void): RealtimeChannel;
    /**
     * Sends a message into the channel.
     *
     * @param args Arguments to send to channel
     * @param args.type The type of event to send
     * @param args.event The name of the event being sent
     * @param args.payload Payload to be sent
     * @param opts Options to be used during the send process
     */
    send(args: {
        type: 'broadcast' | 'presence' | 'postgres_changes';
        event: string;
        payload?: any;
        [key: string]: any;
    }, opts?: {
        [key: string]: any;
    }): Promise<RealtimeChannelSendResponse>;
    updateJoinPayload(payload: {
        [key: string]: any;
    }): void;
    /**
     * Leaves the channel.
     *
     * Unsubscribes from server events, and instructs channel to terminate on server.
     * Triggers onClose() hooks.
     *
     * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
     * channel.unsubscribe().receive("ok", () => alert("left!") )
     */
    unsubscribe(timeout?: number): Promise<'ok' | 'timed out' | 'error'>;
    /**
     * Teardown the channel.
     *
     * Destroys and stops related timers.
     */
    teardown(): void;
}

type Fetch$4 = typeof fetch;
type LogLevel = 'info' | 'warn' | 'error';
type RealtimeMessage = {
    topic: string;
    event: string;
    payload: any;
    ref: string;
    join_ref?: string;
};
type RealtimeRemoveChannelResponse = 'ok' | 'timed out' | 'error';
type HeartbeatStatus = 'sent' | 'ok' | 'error' | 'timeout' | 'disconnected';
interface WebSocketLikeConstructor {
    new (address: string | URL, subprotocols?: string | string[] | undefined): WebSocketLike;
    [key: string]: any;
}
type RealtimeClientOptions = {
    transport?: WebSocketLikeConstructor;
    timeout?: number;
    heartbeatIntervalMs?: number;
    heartbeatCallback?: (status: HeartbeatStatus) => void;
    logger?: Function;
    encode?: Function;
    decode?: Function;
    reconnectAfterMs?: Function;
    headers?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: any;
    };
    log_level?: LogLevel;
    logLevel?: LogLevel;
    fetch?: Fetch$4;
    worker?: boolean;
    workerUrl?: string;
    accessToken?: () => Promise<string | null>;
};
declare class RealtimeClient {
    accessTokenValue: string | null;
    apiKey: string | null;
    channels: RealtimeChannel[];
    endPoint: string;
    httpEndpoint: string;
    /** @deprecated headers cannot be set on websocket connections */
    headers?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: string;
    };
    timeout: number;
    transport: WebSocketLikeConstructor | null;
    heartbeatIntervalMs: number;
    heartbeatTimer: ReturnType<typeof setInterval> | undefined;
    pendingHeartbeatRef: string | null;
    heartbeatCallback: (status: HeartbeatStatus) => void;
    ref: number;
    reconnectTimer: Timer | null;
    logger: Function;
    logLevel?: LogLevel;
    encode: Function;
    decode: Function;
    reconnectAfterMs: Function;
    conn: WebSocketLike | null;
    sendBuffer: Function[];
    serializer: Serializer;
    stateChangeCallbacks: {
        open: Function[];
        close: Function[];
        error: Function[];
        message: Function[];
    };
    fetch: Fetch$4;
    accessToken: (() => Promise<string | null>) | null;
    worker?: boolean;
    workerUrl?: string;
    workerRef?: Worker;
    private _connectionState;
    private _wasManualDisconnect;
    private _authPromise;
    /**
     * Initializes the Socket.
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.heartbeatCallback The optional function to handle heartbeat status.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.logLevel Sets the log level for Realtime
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     * @param options.worker Use Web Worker to set a side flow. Defaults to false.
     * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
     */
    constructor(endPoint: string, options?: RealtimeClientOptions);
    /**
     * Connects the socket, unless already connected.
     */
    connect(): void;
    /**
     * Returns the URL of the websocket.
     * @returns string The URL of the websocket.
     */
    endpointURL(): string;
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     */
    disconnect(code?: number, reason?: string): void;
    /**
     * Returns all created channels
     */
    getChannels(): RealtimeChannel[];
    /**
     * Unsubscribes and removes a single channel
     * @param channel A RealtimeChannel instance
     */
    removeChannel(channel: RealtimeChannel): Promise<RealtimeRemoveChannelResponse>;
    /**
     * Unsubscribes and removes all channels
     */
    removeAllChannels(): Promise<RealtimeRemoveChannelResponse[]>;
    /**
     * Logs the message.
     *
     * For customized logging, `this.logger` can be overridden.
     */
    log(kind: string, msg: string, data?: any): void;
    /**
     * Returns the current state of the socket.
     */
    connectionState(): CONNECTION_STATE;
    /**
     * Returns `true` is the connection is open.
     */
    isConnected(): boolean;
    /**
     * Returns `true` if the connection is currently connecting.
     */
    isConnecting(): boolean;
    /**
     * Returns `true` if the connection is currently disconnecting.
     */
    isDisconnecting(): boolean;
    channel(topic: string, params?: RealtimeChannelOptions): RealtimeChannel;
    /**
     * Push out a message if the socket is connected.
     *
     * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
     */
    push(data: RealtimeMessage): void;
    /**
     * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
     *
     * If param is null it will use the `accessToken` callback function or the token set on the client.
     *
     * On callback used, it will set the value of the token internal to the client.
     *
     * @param token A JWT string to override the token set on the client.
     */
    setAuth(token?: string | null): Promise<void>;
    /**
     * Sends a heartbeat message if the socket is connected.
     */
    sendHeartbeat(): Promise<void>;
    onHeartbeat(callback: (status: HeartbeatStatus) => void): void;
    /**
     * Flushes send buffer
     */
    flushSendBuffer(): void;
    private _workerObjectUrl;
}

/**
 * Error format
 *
 * {@link https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes}
 */
declare class PostgrestError extends Error {
    details: string;
    hint: string;
    code: string;
    constructor(context: {
        message: string;
        details: string;
        hint: string;
        code: string;
    });
}

declare type AggregateWithoutColumnFunctions = 'count';
declare type AggregateWithColumnFunctions = 'sum' | 'avg' | 'min' | 'max' | AggregateWithoutColumnFunctions;
declare type AggregateFunctions = AggregateWithColumnFunctions;
declare type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
declare type PostgresSQLNumberTypes = 'int2' | 'int4' | 'int8' | 'float4' | 'float8' | 'numeric';
declare type PostgresSQLStringTypes = 'bytea' | 'bpchar' | 'varchar' | 'date' | 'text' | 'citext' | 'time' | 'timetz' | 'timestamp' | 'timestamptz' | 'uuid' | 'vector';
declare type SingleValuePostgreSQLTypes = PostgresSQLNumberTypes | PostgresSQLStringTypes | 'bool' | 'json' | 'jsonb' | 'void' | 'record' | string;
declare type ArrayPostgreSQLTypes = `_${SingleValuePostgreSQLTypes}`;
declare type TypeScriptSingleValueTypes<T extends SingleValuePostgreSQLTypes> = T extends 'bool' ? boolean : T extends PostgresSQLNumberTypes ? number : T extends PostgresSQLStringTypes ? string : T extends 'json' | 'jsonb' ? Json : T extends 'void' ? undefined : T extends 'record' ? Record<string, unknown> : unknown;
declare type StripUnderscore<T extends string> = T extends `_${infer U}` ? U : T;
declare type PostgreSQLTypes = SingleValuePostgreSQLTypes | ArrayPostgreSQLTypes;
declare type TypeScriptTypes<T extends PostgreSQLTypes> = T extends ArrayPostgreSQLTypes ? TypeScriptSingleValueTypes<StripUnderscore<Extract<T, SingleValuePostgreSQLTypes>>>[] : TypeScriptSingleValueTypes<T>;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
declare type Push<T extends any[], V> = [...T, V];
declare type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = N extends true ? [] : Push<UnionToTuple<Exclude<T, L>>, L>;
declare type UnionToArray<T> = UnionToTuple<T>;
declare type ExtractFirstProperty<T> = T extends {
    [K in keyof T]: infer U;
} ? U : never;
declare type ContainsNull<T> = null extends T ? true : false;
declare type IsNonEmptyArray<T> = Exclude<T, undefined> extends readonly [unknown, ...unknown[]] ? true : false;
declare type TablesAndViews<Schema extends GenericSchema$1> = Schema['Tables'] & Exclude<Schema['Views'], ''>;

/**
 * Parses a query.
 * A query is a sequence of nodes, separated by `,`, ensuring that there is
 * no remaining input after all nodes have been parsed.
 *
 * Returns an array of parsed nodes, or an error.
 */
declare type ParseQuery<Query extends string> = string extends Query ? GenericStringError : ParseNodes<EatWhitespace<Query>> extends [infer Nodes, `${infer Remainder}`] ? Nodes extends Ast.Node[] ? EatWhitespace<Remainder> extends '' ? SimplifyDeep<Nodes> : ParserError<`Unexpected input: ${Remainder}`> : ParserError<'Invalid nodes array structure'> : ParseNodes<EatWhitespace<Query>>;
/**
 * Notes: all `Parse*` types assume that their input strings have their whitespace
 * removed. They return tuples of ["Return Value", "Remainder of text"] or
 * a `ParserError`.
 */
/**
 * Parses a sequence of nodes, separated by `,`.
 *
 * Returns a tuple of ["Parsed fields", "Remainder of text"] or an error.
 */
declare type ParseNodes<Input extends string> = string extends Input ? GenericStringError : ParseNodesHelper<Input, []>;
declare type ParseNodesHelper<Input extends string, Nodes extends Ast.Node[]> = ParseNode<Input> extends [
    infer Node,
    `${infer Remainder}`
] ? Node extends Ast.Node ? EatWhitespace<Remainder> extends `,${infer Remainder}` ? ParseNodesHelper<EatWhitespace<Remainder>, [...Nodes, Node]> : [[...Nodes, Node], EatWhitespace<Remainder>] : ParserError<'Invalid node type in nodes helper'> : ParseNode<Input>;
/**
 * Parses a node.
 * A node is one of the following:
 * - `*`
 * - a field, as defined above
 * - a renamed field, `renamed_field:field`
 * - a spread field, `...field`
 */
declare type ParseNode<Input extends string> = Input extends '' ? ParserError<'Empty string'> : Input extends `*${infer Remainder}` ? [Ast.StarNode, EatWhitespace<Remainder>] : Input extends `...${infer Remainder}` ? ParseField<EatWhitespace<Remainder>> extends [infer TargetField, `${infer Remainder}`] ? TargetField extends Ast.FieldNode ? [{
    type: 'spread';
    target: TargetField;
}, EatWhitespace<Remainder>] : ParserError<'Invalid target field type in spread'> : ParserError<`Unable to parse spread resource at \`${Input}\``> : ParseIdentifier<Input> extends [infer NameOrAlias, `${infer Remainder}`] ? EatWhitespace<Remainder> extends `::${infer _}` ? ParseField<Input> : EatWhitespace<Remainder> extends `:${infer Remainder}` ? ParseField<EatWhitespace<Remainder>> extends [infer Field, `${infer Remainder}`] ? Field extends Ast.FieldNode ? [Omit<Field, 'alias'> & {
    alias: NameOrAlias;
}, EatWhitespace<Remainder>] : ParserError<'Invalid field type in alias parsing'> : ParserError<`Unable to parse renamed field at \`${Input}\``> : ParseField<Input> : ParserError<`Expected identifier at \`${Input}\``>;
/**
 * Parses a field without preceding alias.
 * A field is one of the following:
 * - a top-level `count` field: https://docs.postgrest.org/en/v12/references/api/aggregate_functions.html#the-case-of-count
 * - a field with an embedded resource
 *   - `field(nodes)`
 *   - `field!hint(nodes)`
 *   - `field!inner(nodes)`
 *   - `field!left(nodes)`
 *   - `field!hint!inner(nodes)`
 *   - `field!hint!left(nodes)`
 * - a field without an embedded resource (see {@link ParseNonEmbeddedResourceField})
 */
declare type ParseField<Input extends string> = Input extends '' ? ParserError<'Empty string'> : ParseIdentifier<Input> extends [infer Name, `${infer Remainder}`] ? Name extends 'count' ? ParseCountField<Input> : Remainder extends `!inner${infer Remainder}` ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [infer Children, `${infer Remainder}`] ? Children extends Ast.Node[] ? [
    {
        type: 'field';
        name: Name;
        innerJoin: true;
        children: Children;
    },
    Remainder
] : ParserError<'Invalid children array in inner join'> : CreateParserErrorIfRequired<ParseEmbeddedResource<EatWhitespace<Remainder>>, `Expected embedded resource after "!inner" at \`${Remainder}\``> : EatWhitespace<Remainder> extends `!left${infer Remainder}` ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [infer Children, `${infer Remainder}`] ? Children extends Ast.Node[] ? [
    {
        type: 'field';
        name: Name;
        children: Children;
    },
    EatWhitespace<Remainder>
] : ParserError<'Invalid children array in left join'> : CreateParserErrorIfRequired<ParseEmbeddedResource<EatWhitespace<Remainder>>, `Expected embedded resource after "!left" at \`${EatWhitespace<Remainder>}\``> : EatWhitespace<Remainder> extends `!${infer Remainder}` ? ParseIdentifier<EatWhitespace<Remainder>> extends [infer Hint, `${infer Remainder}`] ? EatWhitespace<Remainder> extends `!inner${infer Remainder}` ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [
    infer Children,
    `${infer Remainder}`
] ? Children extends Ast.Node[] ? [
    {
        type: 'field';
        name: Name;
        hint: Hint;
        innerJoin: true;
        children: Children;
    },
    EatWhitespace<Remainder>
] : ParserError<'Invalid children array in hint inner join'> : ParseEmbeddedResource<EatWhitespace<Remainder>> : ParseEmbeddedResource<EatWhitespace<Remainder>> extends [
    infer Children,
    `${infer Remainder}`
] ? Children extends Ast.Node[] ? [
    {
        type: 'field';
        name: Name;
        hint: Hint;
        children: Children;
    },
    EatWhitespace<Remainder>
] : ParserError<'Invalid children array in hint'> : ParseEmbeddedResource<EatWhitespace<Remainder>> : ParserError<`Expected identifier after "!" at \`${EatWhitespace<Remainder>}\``> : EatWhitespace<Remainder> extends `(${infer _}` ? ParseEmbeddedResource<EatWhitespace<Remainder>> extends [infer Children, `${infer Remainder}`] ? Children extends Ast.Node[] ? [
    {
        type: 'field';
        name: Name;
        children: Children;
    },
    EatWhitespace<Remainder>
] : ParserError<'Invalid children array in field'> : ParseEmbeddedResource<EatWhitespace<Remainder>> : ParseNonEmbeddedResourceField<Input> : ParserError<`Expected identifier at \`${Input}\``>;
declare type ParseCountField<Input extends string> = ParseIdentifier<Input> extends [
    'count',
    `${infer Remainder}`
] ? (EatWhitespace<Remainder> extends `()${infer Remainder_}` ? EatWhitespace<Remainder_> : EatWhitespace<Remainder>) extends `${infer Remainder}` ? Remainder extends `::${infer _}` ? ParseFieldTypeCast<Remainder> extends [infer CastType, `${infer Remainder}`] ? [
    {
        type: 'field';
        name: 'count';
        aggregateFunction: 'count';
        castType: CastType;
    },
    Remainder
] : ParseFieldTypeCast<Remainder> : [{
    type: 'field';
    name: 'count';
    aggregateFunction: 'count';
}, Remainder] : never : ParserError<`Expected "count" at \`${Input}\``>;
/**
 * Parses an embedded resource, which is an opening `(`, followed by a sequence of
 * 0 or more nodes separated by `,`, then a closing `)`.
 *
 * Returns a tuple of ["Parsed fields", "Remainder of text"], an error,
 * or the original string input indicating that no opening `(` was found.
 */
declare type ParseEmbeddedResource<Input extends string> = Input extends `(${infer Remainder}` ? EatWhitespace<Remainder> extends `)${infer Remainder}` ? [[], EatWhitespace<Remainder>] : ParseNodes<EatWhitespace<Remainder>> extends [infer Nodes, `${infer Remainder}`] ? Nodes extends Ast.Node[] ? EatWhitespace<Remainder> extends `)${infer Remainder}` ? [Nodes, EatWhitespace<Remainder>] : ParserError<`Expected ")" at \`${EatWhitespace<Remainder>}\``> : ParserError<'Invalid nodes array in embedded resource'> : ParseNodes<EatWhitespace<Remainder>> : ParserError<`Expected "(" at \`${Input}\``>;
/**
 * Parses a field excluding embedded resources, without preceding field renaming.
 * This is one of the following:
 * - `field`
 * - `field.aggregate()`
 * - `field.aggregate()::type`
 * - `field::type`
 * - `field::type.aggregate()`
 * - `field::type.aggregate()::type`
 * - `field->json...`
 * - `field->json.aggregate()`
 * - `field->json.aggregate()::type`
 * - `field->json::type`
 * - `field->json::type.aggregate()`
 * - `field->json::type.aggregate()::type`
 */
declare type ParseNonEmbeddedResourceField<Input extends string> = ParseIdentifier<Input> extends [
    infer Name,
    `${infer Remainder}`
] ? (Remainder extends `->${infer PathAndRest}` ? ParseJsonAccessor<Remainder> extends [
    infer PropertyName,
    infer PropertyType,
    `${infer Remainder}`
] ? [
    {
        type: 'field';
        name: Name;
        alias: PropertyName;
        castType: PropertyType;
        jsonPath: JsonPathToAccessor<PathAndRest extends `${infer Path},${string}` ? Path : PathAndRest>;
    },
    Remainder
] : ParseJsonAccessor<Remainder> : [{
    type: 'field';
    name: Name;
}, Remainder]) extends infer Parsed ? Parsed extends [infer Field, `${infer Remainder}`] ? (Remainder extends `::${infer _}` ? ParseFieldTypeCast<Remainder> extends [infer CastType, `${infer Remainder}`] ? [Omit<Field, 'castType'> & {
    castType: CastType;
}, Remainder] : ParseFieldTypeCast<Remainder> : [Field, Remainder]) extends infer Parsed ? Parsed extends [infer Field, `${infer Remainder}`] ? Remainder extends `.${infer _}` ? ParseFieldAggregation<Remainder> extends [
    infer AggregateFunction,
    `${infer Remainder}`
] ? Remainder extends `::${infer _}` ? ParseFieldTypeCast<Remainder> extends [infer CastType, `${infer Remainder}`] ? [
    Omit<Field, 'castType'> & {
        aggregateFunction: AggregateFunction;
        castType: CastType;
    },
    Remainder
] : ParseFieldTypeCast<Remainder> : [Field & {
    aggregateFunction: AggregateFunction;
}, Remainder] : ParseFieldAggregation<Remainder> : [Field, Remainder] : Parsed : never : Parsed : never : ParserError<`Expected identifier at \`${Input}\``>;
/**
 * Parses a JSON property accessor of the shape `->a->b->c`. The last accessor in
 * the series may convert to text by using the ->> operator instead of ->.
 *
 * Returns a tuple of ["Last property name", "Last property type", "Remainder of text"]
 */
declare type ParseJsonAccessor<Input extends string> = Input extends `->${infer Remainder}` ? Remainder extends `>${infer Remainder}` ? ParseIdentifier<Remainder> extends [infer Name, `${infer Remainder}`] ? [Name, 'text', EatWhitespace<Remainder>] : ParserError<'Expected property name after `->>`'> : ParseIdentifier<Remainder> extends [infer Name, `${infer Remainder}`] ? ParseJsonAccessor<Remainder> extends [
    infer PropertyName,
    infer PropertyType,
    `${infer Remainder}`
] ? [PropertyName, PropertyType, EatWhitespace<Remainder>] : [Name, 'json', EatWhitespace<Remainder>] : ParserError<'Expected property name after `->`'> : ParserError<'Expected ->'>;
/**
 * Parses a field typecast (`::type`), returning a tuple of ["Type", "Remainder of text"].
 */
declare type ParseFieldTypeCast<Input extends string> = EatWhitespace<Input> extends `::${infer Remainder}` ? ParseIdentifier<EatWhitespace<Remainder>> extends [`${infer CastType}`, `${infer Remainder}`] ? [CastType, EatWhitespace<Remainder>] : ParserError<`Invalid type for \`::\` operator at \`${Remainder}\``> : ParserError<'Expected ::'>;
/**
 * Parses a field aggregation (`.max()`), returning a tuple of ["Aggregate function", "Remainder of text"]
 */
declare type ParseFieldAggregation<Input extends string> = EatWhitespace<Input> extends `.${infer Remainder}` ? ParseIdentifier<EatWhitespace<Remainder>> extends [
    `${infer FunctionName}`,
    `${infer Remainder}`
] ? FunctionName extends Token.AggregateFunction ? EatWhitespace<Remainder> extends `()${infer Remainder}` ? [FunctionName, EatWhitespace<Remainder>] : ParserError<`Expected \`()\` after \`.\` operator \`${FunctionName}\``> : ParserError<`Invalid type for \`.\` operator \`${FunctionName}\``> : ParserError<`Invalid type for \`.\` operator at \`${Remainder}\``> : ParserError<'Expected .'>;
/**
 * Parses a (possibly double-quoted) identifier.
 * Identifiers are sequences of 1 or more letters.
 */
declare type ParseIdentifier<Input extends string> = ParseLetters<Input> extends [
    infer Name,
    `${infer Remainder}`
] ? [Name, EatWhitespace<Remainder>] : ParseQuotedLetters<Input> extends [infer Name, `${infer Remainder}`] ? [Name, EatWhitespace<Remainder>] : ParserError<`No (possibly double-quoted) identifier at \`${Input}\``>;
/**
 * Parse a consecutive sequence of 1 or more letter, where letters are `[0-9a-zA-Z_]`.
 */
declare type ParseLetters<Input extends string> = string extends Input ? GenericStringError : ParseLettersHelper<Input, ''> extends [`${infer Letters}`, `${infer Remainder}`] ? Letters extends '' ? ParserError<`Expected letter at \`${Input}\``> : [Letters, Remainder] : ParseLettersHelper<Input, ''>;
declare type ParseLettersHelper<Input extends string, Acc extends string> = string extends Input ? GenericStringError : Input extends `${infer L}${infer Remainder}` ? L extends Token.Letter ? ParseLettersHelper<Remainder, `${Acc}${L}`> : [Acc, Input] : [Acc, ''];
/**
 * Parse a consecutive sequence of 1 or more double-quoted letters,
 * where letters are `[^"]`.
 */
declare type ParseQuotedLetters<Input extends string> = string extends Input ? GenericStringError : Input extends `"${infer Remainder}` ? ParseQuotedLettersHelper<Remainder, ''> extends [`${infer Letters}`, `${infer Remainder}`] ? Letters extends '' ? ParserError<`Expected string at \`${Remainder}\``> : [Letters, Remainder] : ParseQuotedLettersHelper<Remainder, ''> : ParserError<`Not a double-quoted string at \`${Input}\``>;
declare type ParseQuotedLettersHelper<Input extends string, Acc extends string> = string extends Input ? GenericStringError : Input extends `${infer L}${infer Remainder}` ? L extends '"' ? [Acc, Remainder] : ParseQuotedLettersHelper<Remainder, `${Acc}${L}`> : ParserError<`Missing closing double-quote in \`"${Acc}${Input}\``>;
/**
 * Trims whitespace from the left of the input.
 */
declare type EatWhitespace<Input extends string> = string extends Input ? GenericStringError : Input extends `${Token.Whitespace}${infer Remainder}` ? EatWhitespace<Remainder> : Input;
/**
 * Creates a new {@link ParserError} if the given input is not already a parser error.
 */
declare type CreateParserErrorIfRequired<Input, Message extends string> = Input extends ParserError<string> ? Input : ParserError<Message>;
/**
 * Parser errors.
 */
declare type ParserError<Message extends string> = {
    error: true;
} & Message;
declare type GenericStringError = ParserError<'Received a generic string'>;
declare namespace Ast {
    type Node = FieldNode | StarNode | SpreadNode;
    type FieldNode = {
        type: 'field';
        name: string;
        alias?: string;
        hint?: string;
        innerJoin?: true;
        castType?: string;
        jsonPath?: string;
        aggregateFunction?: Token.AggregateFunction;
        children?: Node[];
    };
    type StarNode = {
        type: 'star';
    };
    type SpreadNode = {
        type: 'spread';
        target: FieldNode & {
            children: Node[];
        };
    };
}
declare namespace Token {
    export type Whitespace = ' ' | '\n' | '\t';
    type LowerAlphabet = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
    type Alphabet = LowerAlphabet | Uppercase<LowerAlphabet>;
    type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
    export type Letter = Alphabet | Digit | '_';
    export type AggregateFunction = 'count' | 'sum' | 'avg' | 'min' | 'max';
    export {};
}

declare type IsAny<T> = 0 extends 1 & T ? true : false;
declare type SelectQueryError<Message extends string> = {
    error: true;
} & Message;
declare type DeduplicateRelationships<T extends readonly unknown[]> = T extends readonly [
    infer First,
    ...infer Rest
] ? First extends Rest[number] ? DeduplicateRelationships<Rest extends readonly unknown[] ? Rest : []> : [First, ...DeduplicateRelationships<Rest extends readonly unknown[] ? Rest : []>] : T;
declare type GetFieldNodeResultName<Field extends Ast.FieldNode> = Field['alias'] extends string ? Field['alias'] : Field['aggregateFunction'] extends AggregateFunctions ? Field['aggregateFunction'] : Field['name'];
declare type FilterRelationNodes<Nodes extends Ast.Node[]> = UnionToArray<{
    [K in keyof Nodes]: Nodes[K] extends Ast.SpreadNode ? Nodes[K]['target'] : Nodes[K] extends Ast.FieldNode ? IsNonEmptyArray<Nodes[K]['children']> extends true ? Nodes[K] : never : never;
}[number]>;
declare type ResolveRelationships<Schema extends GenericSchema$1, RelationName extends string, Relationships extends GenericRelationship$1[], Nodes extends Ast.FieldNode[]> = UnionToArray<{
    [K in keyof Nodes]: Nodes[K] extends Ast.FieldNode ? ResolveRelationship<Schema, Relationships, Nodes[K], RelationName> extends infer Relation ? Relation extends {
        relation: {
            referencedRelation: string;
            foreignKeyName: string;
            match: string;
        };
        from: string;
    } ? {
        referencedTable: Relation['relation']['referencedRelation'];
        fkName: Relation['relation']['foreignKeyName'];
        from: Relation['from'];
        match: Relation['relation']['match'];
        fieldName: GetFieldNodeResultName<Nodes[K]>;
    } : Relation : never : never;
}>[0];
/**
 * Checks if a relation is implicitly referenced twice, requiring disambiguation
 */
declare type IsDoubleReference<T, U> = T extends {
    referencedTable: infer RT;
    fieldName: infer FN;
    match: infer M;
} ? M extends 'col' | 'refrel' ? U extends {
    referencedTable: RT;
    fieldName: FN;
    match: M;
} ? true : false : false : false;
/**
 * Compares one element with all other elements in the array to find duplicates
 */
declare type CheckDuplicates<Arr extends any[], Current> = Arr extends [infer Head, ...infer Tail] ? IsDoubleReference<Current, Head> extends true ? Head | CheckDuplicates<Tail, Current> : CheckDuplicates<Tail, Current> : never;
/**
 * Iterates over the elements of the array to find duplicates
 */
declare type FindDuplicatesWithinDeduplicated<Arr extends any[]> = Arr extends [infer Head, ...infer Tail] ? CheckDuplicates<Tail, Head> | FindDuplicatesWithinDeduplicated<Tail> : never;
declare type FindDuplicates<Arr extends any[]> = FindDuplicatesWithinDeduplicated<DeduplicateRelationships<Arr>>;
declare type CheckDuplicateEmbededReference<Schema extends GenericSchema$1, RelationName extends string, Relationships extends GenericRelationship$1[], Nodes extends Ast.Node[]> = FilterRelationNodes<Nodes> extends infer RelationsNodes ? RelationsNodes extends Ast.FieldNode[] ? ResolveRelationships<Schema, RelationName, Relationships, RelationsNodes> extends infer ResolvedRels ? ResolvedRels extends unknown[] ? FindDuplicates<ResolvedRels> extends infer Duplicates ? Duplicates extends never ? false : Duplicates extends {
    fieldName: infer FieldName;
} ? FieldName extends string ? {
    [K in FieldName]: SelectQueryError<`table "${RelationName}" specified more than once use hinting for desambiguation`>;
} : false : false : false : false : false : false : false;
/**
 * Returns a boolean representing whether there is a foreign key referencing
 * a given relation.
 */
declare type HasFKeyToFRel<FRelName, Relationships> = Relationships extends [infer R] ? R extends {
    referencedRelation: FRelName;
} ? true : false : Relationships extends [infer R, ...infer Rest] ? HasFKeyToFRel<FRelName, [R]> extends true ? true : HasFKeyToFRel<FRelName, Rest> : false;
/**
 * Checks if there is more than one relation to a given foreign relation name in the Relationships.
 */
declare type HasMultipleFKeysToFRelDeduplicated<FRelName, Relationships> = Relationships extends [
    infer R,
    ...infer Rest
] ? R extends {
    referencedRelation: FRelName;
} ? HasFKeyToFRel<FRelName, Rest> extends true ? true : HasMultipleFKeysToFRelDeduplicated<FRelName, Rest> : HasMultipleFKeysToFRelDeduplicated<FRelName, Rest> : false;
declare type HasMultipleFKeysToFRel<FRelName, Relationships extends unknown[]> = HasMultipleFKeysToFRelDeduplicated<FRelName, DeduplicateRelationships<Relationships>>;
declare type CheckRelationshipError<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], CurrentTableOrView extends keyof TablesAndViews<Schema> & string, FoundRelation> = FoundRelation extends SelectQueryError<string> ? FoundRelation : FoundRelation extends {
    relation: {
        referencedRelation: infer RelatedRelationName;
        name: string;
    };
    direction: 'reverse';
} ? RelatedRelationName extends string ? HasMultipleFKeysToFRel<RelatedRelationName, Relationships> extends true ? SelectQueryError<`Could not embed because more than one relationship was found for '${RelatedRelationName}' and '${CurrentTableOrView}' you need to hint the column with ${RelatedRelationName}!<columnName> ?`> : FoundRelation : never : FoundRelation extends {
    relation: {
        referencedRelation: infer RelatedRelationName;
        name: string;
    };
    direction: 'forward';
    from: infer From;
} ? RelatedRelationName extends string ? From extends keyof TablesAndViews<Schema> & string ? HasMultipleFKeysToFRel<RelatedRelationName, TablesAndViews<Schema>[From]['Relationships']> extends true ? SelectQueryError<`Could not embed because more than one relationship was found for '${From}' and '${RelatedRelationName}' you need to hint the column with ${From}!<columnName> ?`> : FoundRelation : never : never : FoundRelation;
/**
 * Resolves relationships for embedded resources and retrieves the referenced Table
 */
declare type ResolveRelationship<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], Field extends Ast.FieldNode, CurrentTableOrView extends keyof TablesAndViews<Schema> & string> = ResolveReverseRelationship<Schema, Relationships, Field, CurrentTableOrView> extends infer ReverseRelationship ? ReverseRelationship extends false ? CheckRelationshipError<Schema, Relationships, CurrentTableOrView, ResolveForwardRelationship<Schema, Field, CurrentTableOrView>> : CheckRelationshipError<Schema, Relationships, CurrentTableOrView, ReverseRelationship> : never;
/**
 * Resolves reverse relationships (from children to parent)
 */
declare type ResolveReverseRelationship<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], Field extends Ast.FieldNode, CurrentTableOrView extends keyof TablesAndViews<Schema> & string> = FindFieldMatchingRelationships<Schema, Relationships, Field> extends infer FoundRelation ? FoundRelation extends never ? false : FoundRelation extends {
    referencedRelation: infer RelatedRelationName;
} ? RelatedRelationName extends string ? RelatedRelationName extends keyof TablesAndViews<Schema> ? FoundRelation extends {
    hint: string;
} ? {
    referencedTable: TablesAndViews<Schema>[RelatedRelationName];
    relation: FoundRelation;
    direction: 'reverse';
    from: CurrentTableOrView;
} : HasMultipleFKeysToFRel<RelatedRelationName, Relationships> extends true ? SelectQueryError<`Could not embed because more than one relationship was found for '${RelatedRelationName}' and '${CurrentTableOrView}' you need to hint the column with ${RelatedRelationName}!<columnName> ?`> : {
    referencedTable: TablesAndViews<Schema>[RelatedRelationName];
    relation: FoundRelation;
    direction: 'reverse';
    from: CurrentTableOrView;
} : SelectQueryError<`Relation '${RelatedRelationName}' not found in schema.`> : false : false : false;
declare type FindMatchingTableRelationships<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], value extends string> = Relationships extends [infer R, ...infer Rest] ? Rest extends GenericRelationship$1[] ? R extends {
    referencedRelation: infer ReferencedRelation;
} ? ReferencedRelation extends keyof Schema['Tables'] ? R extends {
    foreignKeyName: value;
} ? R & {
    match: 'fkname';
} : R extends {
    referencedRelation: value;
} ? R & {
    match: 'refrel';
} : R extends {
    columns: [value];
} ? R & {
    match: 'col';
} : FindMatchingTableRelationships<Schema, Rest, value> : FindMatchingTableRelationships<Schema, Rest, value> : false : false : false;
declare type FindMatchingViewRelationships<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], value extends string> = Relationships extends [infer R, ...infer Rest] ? Rest extends GenericRelationship$1[] ? R extends {
    referencedRelation: infer ReferencedRelation;
} ? ReferencedRelation extends keyof Schema['Views'] ? R extends {
    foreignKeyName: value;
} ? R & {
    match: 'fkname';
} : R extends {
    referencedRelation: value;
} ? R & {
    match: 'refrel';
} : R extends {
    columns: [value];
} ? R & {
    match: 'col';
} : FindMatchingViewRelationships<Schema, Rest, value> : FindMatchingViewRelationships<Schema, Rest, value> : false : false : false;
declare type FindMatchingHintTableRelationships<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], hint extends string, name extends string> = Relationships extends [infer R, ...infer Rest] ? Rest extends GenericRelationship$1[] ? R extends {
    referencedRelation: infer ReferencedRelation;
} ? ReferencedRelation extends name ? R extends {
    foreignKeyName: hint;
} ? R & {
    match: 'fkname';
} : R extends {
    referencedRelation: hint;
} ? R & {
    match: 'refrel';
} : R extends {
    columns: [hint];
} ? R & {
    match: 'col';
} : FindMatchingHintTableRelationships<Schema, Rest, hint, name> : FindMatchingHintTableRelationships<Schema, Rest, hint, name> : false : false : false;
declare type FindMatchingHintViewRelationships<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], hint extends string, name extends string> = Relationships extends [infer R, ...infer Rest] ? Rest extends GenericRelationship$1[] ? R extends {
    referencedRelation: infer ReferencedRelation;
} ? ReferencedRelation extends name ? R extends {
    foreignKeyName: hint;
} ? R & {
    match: 'fkname';
} : R extends {
    referencedRelation: hint;
} ? R & {
    match: 'refrel';
} : R extends {
    columns: [hint];
} ? R & {
    match: 'col';
} : FindMatchingHintViewRelationships<Schema, Rest, hint, name> : FindMatchingHintViewRelationships<Schema, Rest, hint, name> : false : false : false;
declare type IsColumnsNullable<Table extends Pick<GenericTable$1, 'Row'>, Columns extends (keyof Table['Row'])[]> = Columns extends [infer Column, ...infer Rest] ? Column extends keyof Table['Row'] ? ContainsNull<Table['Row'][Column]> extends true ? true : IsColumnsNullable<Table, Rest extends (keyof Table['Row'])[] ? Rest : []> : false : false;
declare type IsRelationNullable<Table extends GenericTable$1, Relation extends GenericRelationship$1> = IsColumnsNullable<Table, Relation['columns']>;
declare type TableForwardRelationships<Schema extends GenericSchema$1, TName> = TName extends keyof TablesAndViews<Schema> ? UnionToArray<RecursivelyFindRelationships<Schema, TName, keyof TablesAndViews<Schema>>> extends infer R ? R extends (GenericRelationship$1 & {
    from: keyof TablesAndViews<Schema>;
})[] ? R : [] : [] : [];
declare type RecursivelyFindRelationships<Schema extends GenericSchema$1, TName, Keys extends keyof TablesAndViews<Schema>> = Keys extends infer K ? K extends keyof TablesAndViews<Schema> ? FilterRelationships<TablesAndViews<Schema>[K]['Relationships'], TName, K> extends never ? RecursivelyFindRelationships<Schema, TName, Exclude<Keys, K>> : FilterRelationships<TablesAndViews<Schema>[K]['Relationships'], TName, K> | RecursivelyFindRelationships<Schema, TName, Exclude<Keys, K>> : false : false;
declare type FilterRelationships<R, TName, From> = R extends readonly (infer Rel)[] ? Rel extends {
    referencedRelation: TName;
} ? Rel & {
    from: From;
} : never : never;
declare type ResolveForwardRelationship<Schema extends GenericSchema$1, Field extends Ast.FieldNode, CurrentTableOrView extends keyof TablesAndViews<Schema> & string> = FindFieldMatchingRelationships<Schema, TablesAndViews<Schema>[Field['name']]['Relationships'], Ast.FieldNode & {
    name: CurrentTableOrView;
    hint: Field['hint'];
}> extends infer FoundByName ? FoundByName extends GenericRelationship$1 ? {
    referencedTable: TablesAndViews<Schema>[Field['name']];
    relation: FoundByName;
    direction: 'forward';
    from: Field['name'];
    type: 'found-by-name';
} : FindFieldMatchingRelationships<Schema, TableForwardRelationships<Schema, CurrentTableOrView>, Field> extends infer FoundByMatch ? FoundByMatch extends GenericRelationship$1 & {
    from: keyof TablesAndViews<Schema>;
} ? {
    referencedTable: TablesAndViews<Schema>[FoundByMatch['from']];
    relation: FoundByMatch;
    direction: 'forward';
    from: CurrentTableOrView;
    type: 'found-by-match';
} : FindJoinTableRelationship<Schema, CurrentTableOrView, Field['name']> extends infer FoundByJoinTable ? FoundByJoinTable extends GenericRelationship$1 ? {
    referencedTable: TablesAndViews<Schema>[FoundByJoinTable['referencedRelation']];
    relation: FoundByJoinTable & {
        match: 'refrel';
    };
    direction: 'forward';
    from: CurrentTableOrView;
    type: 'found-by-join-table';
} : SelectQueryError<`could not find the relation between ${CurrentTableOrView} and ${Field['name']}`> : SelectQueryError<`could not find the relation between ${CurrentTableOrView} and ${Field['name']}`> : SelectQueryError<`could not find the relation between ${CurrentTableOrView} and ${Field['name']}`> : SelectQueryError<`could not find the relation between ${CurrentTableOrView} and ${Field['name']}`>;
/**
 * Given a CurrentTableOrView, finds all join tables to this relation.
 * For example, if products and categories are linked via product_categories table:
 *
 * @example
 * Given:
 * - CurrentTableView = 'products'
 * - FieldName = "categories"
 *
 * It should return this relationship from product_categories:
 * {
 *   foreignKeyName: "product_categories_category_id_fkey",
 *   columns: ["category_id"],
 *   isOneToOne: false,
 *   referencedRelation: "categories",
 *   referencedColumns: ["id"]
 * }
 */
declare type ResolveJoinTableRelationship<Schema extends GenericSchema$1, CurrentTableOrView extends keyof TablesAndViews<Schema> & string, FieldName extends string> = {
    [TableName in keyof TablesAndViews<Schema>]: DeduplicateRelationships<TablesAndViews<Schema>[TableName]['Relationships']> extends readonly (infer Rel)[] ? Rel extends {
        referencedRelation: CurrentTableOrView;
    } ? DeduplicateRelationships<TablesAndViews<Schema>[TableName]['Relationships']> extends readonly (infer OtherRel)[] ? OtherRel extends {
        referencedRelation: FieldName;
    } ? OtherRel : never : never : never : never;
}[keyof TablesAndViews<Schema>];
declare type FindJoinTableRelationship<Schema extends GenericSchema$1, CurrentTableOrView extends keyof TablesAndViews<Schema> & string, FieldName extends string> = ResolveJoinTableRelationship<Schema, CurrentTableOrView, FieldName> extends infer Result ? [Result] extends [never] ? false : Result : never;
/**
 * Finds a matching relationship based on the FieldNode's name and optional hint.
 */
declare type FindFieldMatchingRelationships<Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], Field extends Ast.FieldNode> = Field extends {
    hint: string;
} ? FindMatchingHintTableRelationships<Schema, Relationships, Field['hint'], Field['name']> extends GenericRelationship$1 ? FindMatchingHintTableRelationships<Schema, Relationships, Field['hint'], Field['name']> & {
    branch: 'found-in-table-via-hint';
    hint: Field['hint'];
} : FindMatchingHintViewRelationships<Schema, Relationships, Field['hint'], Field['name']> extends GenericRelationship$1 ? FindMatchingHintViewRelationships<Schema, Relationships, Field['hint'], Field['name']> & {
    branch: 'found-in-view-via-hint';
    hint: Field['hint'];
} : SelectQueryError<'Failed to find matching relation via hint'> : FindMatchingTableRelationships<Schema, Relationships, Field['name']> extends GenericRelationship$1 ? FindMatchingTableRelationships<Schema, Relationships, Field['name']> & {
    branch: 'found-in-table-via-name';
    name: Field['name'];
} : FindMatchingViewRelationships<Schema, Relationships, Field['name']> extends GenericRelationship$1 ? FindMatchingViewRelationships<Schema, Relationships, Field['name']> & {
    branch: 'found-in-view-via-name';
    name: Field['name'];
} : SelectQueryError<'Failed to find matching relation via name'>;
declare type JsonPathToAccessor<Path extends string> = Path extends `${infer P1}->${infer P2}` ? P2 extends `>${infer Rest}` ? JsonPathToAccessor<`${P1}.${Rest}`> : P2 extends string ? JsonPathToAccessor<`${P1}.${P2}`> : Path : Path extends `>${infer Rest}` ? JsonPathToAccessor<Rest> : Path extends `${infer P1}::${infer _}` ? JsonPathToAccessor<P1> : Path extends `${infer P1}${')' | ','}${infer _}` ? P1 : Path;
declare type JsonPathToType<T, Path extends string> = Path extends '' ? T : ContainsNull<T> extends true ? JsonPathToType<Exclude<T, null>, Path> : Path extends `${infer Key}.${infer Rest}` ? Key extends keyof T ? JsonPathToType<T[Key], Rest> : never : Path extends keyof T ? T[Path] : never;
declare type IsStringUnion<T> = string extends T ? false : T extends string ? [T] extends [never] ? false : true : false;
declare type ComputedField<Schema extends GenericSchema$1, RelationName extends keyof TablesAndViews<Schema>, FieldName extends keyof TablesAndViews<Schema>[RelationName]['Row']> = FieldName extends keyof Schema['Functions'] ? Schema['Functions'][FieldName] extends {
    Args: {
        '': TablesAndViews<Schema>[RelationName]['Row'];
    };
    Returns: any;
} ? FieldName : never : never;
declare type GetComputedFields<Schema extends GenericSchema$1, RelationName extends keyof TablesAndViews<Schema>> = {
    [K in keyof TablesAndViews<Schema>[RelationName]['Row']]: ComputedField<Schema, RelationName, K>;
}[keyof TablesAndViews<Schema>[RelationName]['Row']];

declare type Fetch$3 = typeof fetch;
/**
 * Response format
 *
 * {@link https://github.com/supabase/supabase-js/issues/32}
 */
interface PostgrestResponseBase {
    status: number;
    statusText: string;
}
interface PostgrestResponseSuccess<T> extends PostgrestResponseBase {
    error: null;
    data: T;
    count: number | null;
}
interface PostgrestResponseFailure extends PostgrestResponseBase {
    error: PostgrestError;
    data: null;
    count: null;
}
declare type PostgrestSingleResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure;
declare type PostgrestMaybeSingleResponse<T> = PostgrestSingleResponse<T | null>;
declare type PostgrestResponse<T> = PostgrestSingleResponse<T[]>;
declare type GenericRelationship$1 = {
    foreignKeyName: string;
    columns: string[];
    isOneToOne?: boolean;
    referencedRelation: string;
    referencedColumns: string[];
};
declare type GenericTable$1 = {
    Row: Record<string, unknown>;
    Insert: Record<string, unknown>;
    Update: Record<string, unknown>;
    Relationships: GenericRelationship$1[];
};
declare type GenericUpdatableView$1 = {
    Row: Record<string, unknown>;
    Insert: Record<string, unknown>;
    Update: Record<string, unknown>;
    Relationships: GenericRelationship$1[];
};
declare type GenericNonUpdatableView$1 = {
    Row: Record<string, unknown>;
    Relationships: GenericRelationship$1[];
};
declare type GenericView$1 = GenericUpdatableView$1 | GenericNonUpdatableView$1;
declare type GenericFunction$1 = {
    Args: Record<string, unknown>;
    Returns: unknown;
};
declare type GenericSchema$1 = {
    Tables: Record<string, GenericTable$1>;
    Views: Record<string, GenericView$1>;
    Functions: Record<string, GenericFunction$1>;
};
declare type ClientServerOptions = {
    PostgrestVersion?: string;
};
declare type MaxAffectedEnabled<PostgrestVersion extends string | undefined> = PostgrestVersion extends `13${string}` ? true : false;
declare type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
declare type SimplifyDeep<Type, ExcludeType = never> = ConditionalSimplifyDeep<Type, ExcludeType | NonRecursiveType | Set<unknown> | Map<unknown, unknown>, object>;
declare type ConditionalSimplifyDeep<Type, ExcludeType = never, IncludeType = unknown> = Type extends ExcludeType ? Type : Type extends IncludeType ? {
    [TypeKey in keyof Type]: ConditionalSimplifyDeep<Type[TypeKey], ExcludeType, IncludeType>;
} : Type;
declare type NonRecursiveType = BuiltIns | Function | (new (...arguments_: any[]) => unknown);
declare type BuiltIns = Primitive | void | Date | RegExp;
declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
declare type IsValidResultOverride<Result, NewResult, ErrorResult, ErrorNewResult> = Result extends any[] ? NewResult extends any[] ? true : ErrorResult : NewResult extends any[] ? ErrorNewResult : true;
/**
 * Utility type to check if array types match between Result and NewResult.
 * Returns either the valid NewResult type or an error message type.
 */
declare type CheckMatchingArrayTypes<Result, NewResult> = Result extends SelectQueryError<string> ? NewResult : IsValidResultOverride<Result, NewResult, {
    Error: 'Type mismatch: Cannot cast array result to a single object. Use .overrideTypes<Array<YourType>> or .returns<Array<YourType>> (deprecated) for array results or .single() to convert the result to a single object';
}, {
    Error: 'Type mismatch: Cannot cast single object to array type. Remove Array wrapper from return type or make sure you are not using .single() up in the calling chain';
}> extends infer ValidationResult ? ValidationResult extends true ? ContainsNull<Result> extends true ? NewResult | null : NewResult : ValidationResult : never;
declare type Simplify<T> = T extends object ? {
    [K in keyof T]: T[K];
} : T;
declare type ExplicitKeys<T> = {
    [K in keyof T]: string extends K ? never : K;
}[keyof T];
declare type MergeExplicit<New, Row> = {
    [K in ExplicitKeys<New> | ExplicitKeys<Row>]: K extends keyof New ? K extends keyof Row ? Row[K] extends SelectQueryError<string> ? New[K] : New[K] extends any[] ? Row[K] extends any[] ? Array<Simplify<MergeDeep<NonNullable<New[K][number]>, NonNullable<Row[K][number]>>>> : New[K] : IsPlainObject<NonNullable<New[K]>> extends true ? IsPlainObject<NonNullable<Row[K]>> extends true ? ContainsNull<New[K]> extends true ? // If the override wants to preserve optionality
    Simplify<MergeDeep<NonNullable<New[K]>, NonNullable<Row[K]>>> | null : Simplify<MergeDeep<New[K], NonNullable<Row[K]>>> : New[K] : New[K] : New[K] : K extends keyof Row ? Row[K] : never;
};
declare type MergeDeep<New, Row> = Simplify<MergeExplicit<New, Row> & (string extends keyof Row ? {
    [K: string]: Row[string];
} : {})>;
declare type IsPlainObject<T> = T extends any[] ? false : T extends object ? true : false;
declare type MergePartialResult<NewResult, Result, Options> = Options extends {
    merge: true;
} ? Result extends any[] ? NewResult extends any[] ? Array<Simplify<MergeDeep<NewResult[number], Result[number]>>> : never : Simplify<MergeDeep<NewResult, Result>> : NewResult;

declare abstract class PostgrestBuilder<ClientOptions extends ClientServerOptions, Result, ThrowOnError extends boolean = false> implements PromiseLike<ThrowOnError extends true ? PostgrestResponseSuccess<Result> : PostgrestSingleResponse<Result>> {
    protected method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE';
    protected url: URL;
    protected headers: Headers;
    protected schema?: string;
    protected body?: unknown;
    protected shouldThrowOnError: boolean;
    protected signal?: AbortSignal;
    protected fetch: Fetch$3;
    protected isMaybeSingle: boolean;
    constructor(builder: {
        method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE';
        url: URL;
        headers: HeadersInit;
        schema?: string;
        body?: unknown;
        shouldThrowOnError?: boolean;
        signal?: AbortSignal;
        fetch?: Fetch$3;
        isMaybeSingle?: boolean;
    });
    /**
     * If there's an error with the query, throwOnError will reject the promise by
     * throwing the error instead of returning it as part of a successful response.
     *
     * {@link https://github.com/supabase/supabase-js/issues/92}
     */
    throwOnError(): this & PostgrestBuilder<ClientOptions, Result, true>;
    /**
     * Set an HTTP header for the request.
     */
    setHeader(name: string, value: string): this;
    then<TResult1 = ThrowOnError extends true ? PostgrestResponseSuccess<Result> : PostgrestSingleResponse<Result>, TResult2 = never>(onfulfilled?: ((value: ThrowOnError extends true ? PostgrestResponseSuccess<Result> : PostgrestSingleResponse<Result>) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
    /**
     * Override the type of the returned `data`.
     *
     * @typeParam NewResult - The new result type to override with
     * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
     */
    returns<NewResult>(): PostgrestBuilder<ClientOptions, CheckMatchingArrayTypes<Result, NewResult>, ThrowOnError>;
    /**
     * Override the type of the returned `data` field in the response.
     *
     * @typeParam NewResult - The new type to cast the response data to
     * @typeParam Options - Optional type configuration (defaults to { merge: true })
     * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
     * @example
     * ```typescript
     * // Merge with existing types (default behavior)
     * const query = supabase
     *   .from('users')
     *   .select()
     *   .overrideTypes<{ custom_field: string }>()
     *
     * // Replace existing types completely
     * const replaceQuery = supabase
     *   .from('users')
     *   .select()
     *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
     * ```
     * @returns A PostgrestBuilder instance with the new type
     */
    overrideTypes<NewResult, Options extends {
        merge?: boolean;
    } = {
        merge: true;
    }>(): PostgrestBuilder<ClientOptions, IsValidResultOverride<Result, NewResult, false, false> extends true ? ContainsNull<Result> extends true ? MergePartialResult<NewResult, NonNullable<Result>, Options> | null : MergePartialResult<NewResult, Result, Options> : CheckMatchingArrayTypes<Result, NewResult>, ThrowOnError>;
}

declare type SpreadOnManyEnabled<PostgrestVersion extends string | undefined> = PostgrestVersion extends `13${string}` ? true : false;
/**
 * Main entry point for constructing the result type of a PostgREST query.
 *
 * @param Schema - Database schema.
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Relationships - Relationships of the current table.
 * @param Query - The select query string literal to parse.
 */
declare type GetResult<Schema extends GenericSchema$1, Row extends Record<string, unknown>, RelationName, Relationships, Query extends string, ClientOptions extends ClientServerOptions> = IsAny<Schema> extends true ? ParseQuery<Query> extends infer ParsedQuery ? ParsedQuery extends Ast.Node[] ? RelationName extends string ? ProcessNodesWithoutSchema<ParsedQuery> : any : ParsedQuery : any : Relationships extends null ? ParseQuery<Query> extends infer ParsedQuery ? ParsedQuery extends Ast.Node[] ? RPCCallNodes<ParsedQuery, RelationName extends string ? RelationName : 'rpc_call', Row> : ParsedQuery : Row : ParseQuery<Query> extends infer ParsedQuery ? ParsedQuery extends Ast.Node[] ? RelationName extends string ? Relationships extends GenericRelationship$1[] ? ProcessNodes<ClientOptions, Schema, Row, RelationName, Relationships, ParsedQuery> : SelectQueryError<'Invalid Relationships cannot infer result type'> : SelectQueryError<'Invalid RelationName cannot infer result type'> : ParsedQuery : never;
declare type ProcessSimpleFieldWithoutSchema<Field extends Ast.FieldNode> = Field['aggregateFunction'] extends AggregateFunctions ? {
    [K in GetFieldNodeResultName<Field>]: Field['castType'] extends PostgreSQLTypes ? TypeScriptTypes<Field['castType']> : number;
} : {
    [K in GetFieldNodeResultName<Field>]: Field['castType'] extends PostgreSQLTypes ? TypeScriptTypes<Field['castType']> : any;
};
declare type ProcessFieldNodeWithoutSchema<Node extends Ast.FieldNode> = IsNonEmptyArray<Node['children']> extends true ? {
    [K in GetFieldNodeResultName<Node>]: Node['children'] extends Ast.Node[] ? ProcessNodesWithoutSchema<Node['children']>[] : ProcessSimpleFieldWithoutSchema<Node>;
} : ProcessSimpleFieldWithoutSchema<Node>;
/**
 * Processes a single Node without schema and returns the resulting TypeScript type.
 */
declare type ProcessNodeWithoutSchema<Node extends Ast.Node> = Node extends Ast.StarNode ? any : Node extends Ast.SpreadNode ? Node['target']['children'] extends Ast.StarNode[] ? any : Node['target']['children'] extends Ast.FieldNode[] ? {
    [P in Node['target']['children'][number] as GetFieldNodeResultName<P>]: P['castType'] extends PostgreSQLTypes ? TypeScriptTypes<P['castType']> : any;
} : any : Node extends Ast.FieldNode ? ProcessFieldNodeWithoutSchema<Node> : any;
/**
 * Processes nodes when Schema is any, providing basic type inference
 */
declare type ProcessNodesWithoutSchema<Nodes extends Ast.Node[], Acc extends Record<string, unknown> = {}> = Nodes extends [infer FirstNode, ...infer RestNodes] ? FirstNode extends Ast.Node ? RestNodes extends Ast.Node[] ? ProcessNodeWithoutSchema<FirstNode> extends infer FieldResult ? FieldResult extends Record<string, unknown> ? ProcessNodesWithoutSchema<RestNodes, Acc & FieldResult> : FieldResult : any : any : any : Prettify<Acc>;
/**
 * Processes a single Node from a select chained after a rpc call
 *
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current rpc function
 * @param NodeType - The Node to process.
 */
declare type ProcessRPCNode<Row extends Record<string, unknown>, RelationName extends string, NodeType extends Ast.Node> = NodeType['type'] extends Ast.StarNode['type'] ? Row : NodeType['type'] extends Ast.FieldNode['type'] ? ProcessSimpleField<Row, RelationName, Extract<NodeType, Ast.FieldNode>> : SelectQueryError<'RPC Unsupported node type.'>;
/**
 * Process select call that can be chained after an rpc call
 */
declare type RPCCallNodes<Nodes extends Ast.Node[], RelationName extends string, Row extends Record<string, unknown>, Acc extends Record<string, unknown> = {}> = Nodes extends [infer FirstNode, ...infer RestNodes] ? FirstNode extends Ast.Node ? RestNodes extends Ast.Node[] ? ProcessRPCNode<Row, RelationName, FirstNode> extends infer FieldResult ? FieldResult extends Record<string, unknown> ? RPCCallNodes<RestNodes, RelationName, Row, Acc & FieldResult> : FieldResult extends SelectQueryError<infer E> ? SelectQueryError<E> : SelectQueryError<'Could not retrieve a valid record or error value'> : SelectQueryError<'Processing node failed.'> : SelectQueryError<'Invalid rest nodes array in RPC call'> : SelectQueryError<'Invalid first node in RPC call'> : Prettify<Acc>;
/**
 * Recursively processes an array of Nodes and accumulates the resulting TypeScript type.
 *
 * @param Schema - Database schema.
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Relationships - Relationships of the current table.
 * @param Nodes - An array of AST nodes to process.
 * @param Acc - Accumulator for the constructed type.
 */
declare type ProcessNodes<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Row extends Record<string, unknown>, RelationName extends string, Relationships extends GenericRelationship$1[], Nodes extends Ast.Node[], Acc extends Record<string, unknown> = {}> = CheckDuplicateEmbededReference<Schema, RelationName, Relationships, Nodes> extends false ? Nodes extends [infer FirstNode, ...infer RestNodes] ? FirstNode extends Ast.Node ? RestNodes extends Ast.Node[] ? ProcessNode<ClientOptions, Schema, Row, RelationName, Relationships, FirstNode> extends infer FieldResult ? FieldResult extends Record<string, unknown> ? ProcessNodes<ClientOptions, Schema, Row, RelationName, Relationships, RestNodes, Acc & FieldResult> : FieldResult extends SelectQueryError<infer E> ? SelectQueryError<E> : SelectQueryError<'Could not retrieve a valid record or error value'> : SelectQueryError<'Processing node failed.'> : SelectQueryError<'Invalid rest nodes array type in ProcessNodes'> : SelectQueryError<'Invalid first node type in ProcessNodes'> : Prettify<Acc> : Prettify<CheckDuplicateEmbededReference<Schema, RelationName, Relationships, Nodes>>;
/**
 * Processes a single Node and returns the resulting TypeScript type.
 *
 * @param Schema - Database schema.
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Relationships - Relationships of the current table.
 * @param NodeType - The Node to process.
 */
declare type ProcessNode<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Row extends Record<string, unknown>, RelationName extends string, Relationships extends GenericRelationship$1[], NodeType extends Ast.Node> = NodeType['type'] extends Ast.StarNode['type'] ? GetComputedFields<Schema, RelationName> extends never ? Row : Omit<Row, GetComputedFields<Schema, RelationName>> : NodeType['type'] extends Ast.SpreadNode['type'] ? ProcessSpreadNode<ClientOptions, Schema, Row, RelationName, Relationships, Extract<NodeType, Ast.SpreadNode>> : NodeType['type'] extends Ast.FieldNode['type'] ? ProcessFieldNode<ClientOptions, Schema, Row, RelationName, Relationships, Extract<NodeType, Ast.FieldNode>> : SelectQueryError<'Unsupported node type.'>;
/**
 * Processes a FieldNode and returns the resulting TypeScript type.
 *
 * @param Schema - Database schema.
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Relationships - Relationships of the current table.
 * @param Field - The FieldNode to process.
 */
declare type ProcessFieldNode<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Row extends Record<string, unknown>, RelationName extends string, Relationships extends GenericRelationship$1[], Field extends Ast.FieldNode> = Field['children'] extends [] ? {} : IsNonEmptyArray<Field['children']> extends true ? ProcessEmbeddedResource<ClientOptions, Schema, Relationships, Field, RelationName> : ProcessSimpleField<Row, RelationName, Field>;
declare type ResolveJsonPathType<Value, Path extends string | undefined, CastType extends PostgreSQLTypes> = Path extends string ? JsonPathToType<Value, Path> extends never ? TypeScriptTypes<CastType> : JsonPathToType<Value, Path> extends infer PathResult ? PathResult extends string ? PathResult : IsStringUnion<PathResult> extends true ? PathResult : CastType extends 'json' ? PathResult : TypeScriptTypes<CastType> : TypeScriptTypes<CastType> : TypeScriptTypes<CastType>;
/**
 * Processes a simple field (without embedded resources).
 *
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Field - The FieldNode to process.
 */
declare type ProcessSimpleField<Row extends Record<string, unknown>, RelationName extends string, Field extends Ast.FieldNode> = Field['name'] extends keyof Row | 'count' ? Field['aggregateFunction'] extends AggregateFunctions ? {
    [K in GetFieldNodeResultName<Field>]: Field['castType'] extends PostgreSQLTypes ? TypeScriptTypes<Field['castType']> : number;
} : {
    [K in GetFieldNodeResultName<Field>]: Field['castType'] extends PostgreSQLTypes ? ResolveJsonPathType<Row[Field['name']], Field['jsonPath'], Field['castType']> : Row[Field['name']];
} : SelectQueryError<`column '${Field['name']}' does not exist on '${RelationName}'.`>;
/**
 * Processes an embedded resource (relation).
 *
 * @param Schema - Database schema.
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Relationships - Relationships of the current table.
 * @param Field - The FieldNode to process.
 */
declare type ProcessEmbeddedResource<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Relationships extends GenericRelationship$1[], Field extends Ast.FieldNode, CurrentTableOrView extends keyof TablesAndViews<Schema> & string> = ResolveRelationship<Schema, Relationships, Field, CurrentTableOrView> extends infer Resolved ? Resolved extends {
    referencedTable: Pick<GenericTable$1, 'Row' | 'Relationships'>;
    relation: GenericRelationship$1 & {
        match: 'refrel' | 'col' | 'fkname';
    };
    direction: string;
} ? ProcessEmbeddedResourceResult<ClientOptions, Schema, Resolved, Field, CurrentTableOrView> : {
    [K in GetFieldNodeResultName<Field>]: Resolved;
} : {
    [K in GetFieldNodeResultName<Field>]: SelectQueryError<'Failed to resolve relationship.'> & string;
};
/**
 * Helper type to process the result of an embedded resource.
 */
declare type ProcessEmbeddedResourceResult<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Resolved extends {
    referencedTable: Pick<GenericTable$1, 'Row' | 'Relationships'>;
    relation: GenericRelationship$1 & {
        match: 'refrel' | 'col' | 'fkname';
    };
    direction: string;
}, Field extends Ast.FieldNode, CurrentTableOrView extends keyof TablesAndViews<Schema>> = ProcessNodes<ClientOptions, Schema, Resolved['referencedTable']['Row'], Field['name'], Resolved['referencedTable']['Relationships'], Field['children'] extends undefined ? [] : Exclude<Field['children'], undefined> extends Ast.Node[] ? Exclude<Field['children'], undefined> : []> extends infer ProcessedChildren ? {
    [K in GetFieldNodeResultName<Field>]: Resolved['direction'] extends 'forward' ? Field extends {
        innerJoin: true;
    } ? Resolved['relation']['isOneToOne'] extends true ? ProcessedChildren : ProcessedChildren[] : Resolved['relation']['isOneToOne'] extends true ? ProcessedChildren | null : ProcessedChildren[] : Resolved['relation']['referencedRelation'] extends CurrentTableOrView ? Resolved['relation']['match'] extends 'col' ? IsRelationNullable<TablesAndViews<Schema>[CurrentTableOrView], Resolved['relation']> extends true ? ProcessedChildren | null : ProcessedChildren : ProcessedChildren[] : IsRelationNullable<TablesAndViews<Schema>[CurrentTableOrView], Resolved['relation']> extends true ? Field extends {
        innerJoin: true;
    } ? ProcessedChildren : ProcessedChildren | null : ProcessedChildren;
} : {
    [K in GetFieldNodeResultName<Field>]: SelectQueryError<'Failed to process embedded resource nodes.'> & string;
};
/**
 * Processes a SpreadNode by processing its target node.
 *
 * @param Schema - Database schema.
 * @param Row - The type of a row in the current table.
 * @param RelationName - The name of the current table or view.
 * @param Relationships - Relationships of the current table.
 * @param Spread - The SpreadNode to process.
 */
declare type ProcessSpreadNode<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Row extends Record<string, unknown>, RelationName extends string, Relationships extends GenericRelationship$1[], Spread extends Ast.SpreadNode> = ProcessNode<ClientOptions, Schema, Row, RelationName, Relationships, Spread['target']> extends infer Result ? Result extends SelectQueryError<infer E> ? SelectQueryError<E> : ExtractFirstProperty<Result> extends unknown[] ? SpreadOnManyEnabled<ClientOptions['PostgrestVersion']> extends true ? ProcessManyToManySpreadNodeResult<Result> : {
    [K in Spread['target']['name']]: SelectQueryError<`"${RelationName}" and "${Spread['target']['name']}" do not form a many-to-one or one-to-one relationship spread not possible`>;
} : ProcessSpreadNodeResult<Result> : never;
/**
 * Helper type to process the result of a many-to-many spread node.
 * Converts all fields in the spread object into arrays.
 */
declare type ProcessManyToManySpreadNodeResult<Result> = Result extends Record<string, SelectQueryError<string> | null> ? Result : ExtractFirstProperty<Result> extends infer SpreadedObject ? SpreadedObject extends Array<Record<string, unknown>> ? {
    [K in keyof SpreadedObject[number]]: Array<SpreadedObject[number][K]>;
} : SelectQueryError<'An error occurred spreading the many-to-many object'> : SelectQueryError<'An error occurred spreading the many-to-many object'>;
/**
 * Helper type to process the result of a spread node.
 */
declare type ProcessSpreadNodeResult<Result> = Result extends Record<string, SelectQueryError<string> | null> ? Result : ExtractFirstProperty<Result> extends infer SpreadedObject ? ContainsNull<SpreadedObject> extends true ? Exclude<{
    [K in keyof SpreadedObject]: SpreadedObject[K] | null;
}, null> : Exclude<{
    [K in keyof SpreadedObject]: SpreadedObject[K];
}, null> : SelectQueryError<'An error occurred spreading the object'>;

declare class PostgrestTransformBuilder<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Row extends Record<string, unknown>, Result, RelationName = unknown, Relationships = unknown, Method = unknown> extends PostgrestBuilder<ClientOptions, Result> {
    /**
     * Perform a SELECT on the query result.
     *
     * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
     * return modified rows. By calling this method, modified rows are returned in
     * `data`.
     *
     * @param columns - The columns to retrieve, separated by commas
     */
    select<Query extends string = '*', NewResultOne = GetResult<Schema, Row, RelationName, Relationships, Query, ClientOptions>>(columns?: Query): PostgrestTransformBuilder<ClientOptions, Schema, Row, NewResultOne[], RelationName, Relationships, Method>;
    order<ColumnName extends string & keyof Row>(column: ColumnName, options?: {
        ascending?: boolean;
        nullsFirst?: boolean;
        referencedTable?: undefined;
    }): this;
    order(column: string, options?: {
        ascending?: boolean;
        nullsFirst?: boolean;
        referencedTable?: string;
    }): this;
    /**
     * @deprecated Use `options.referencedTable` instead of `options.foreignTable`
     */
    order<ColumnName extends string & keyof Row>(column: ColumnName, options?: {
        ascending?: boolean;
        nullsFirst?: boolean;
        foreignTable?: undefined;
    }): this;
    /**
     * @deprecated Use `options.referencedTable` instead of `options.foreignTable`
     */
    order(column: string, options?: {
        ascending?: boolean;
        nullsFirst?: boolean;
        foreignTable?: string;
    }): this;
    /**
     * Limit the query result by `count`.
     *
     * @param count - The maximum number of rows to return
     * @param options - Named parameters
     * @param options.referencedTable - Set this to limit rows of referenced
     * tables instead of the parent table
     * @param options.foreignTable - Deprecated, use `options.referencedTable`
     * instead
     */
    limit(count: number, { foreignTable, referencedTable, }?: {
        foreignTable?: string;
        referencedTable?: string;
    }): this;
    /**
     * Limit the query result by starting at an offset `from` and ending at the offset `to`.
     * Only records within this range are returned.
     * This respects the query order and if there is no order clause the range could behave unexpectedly.
     * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
     * and fourth rows of the query.
     *
     * @param from - The starting index from which to limit the result
     * @param to - The last index to which to limit the result
     * @param options - Named parameters
     * @param options.referencedTable - Set this to limit rows of referenced
     * tables instead of the parent table
     * @param options.foreignTable - Deprecated, use `options.referencedTable`
     * instead
     */
    range(from: number, to: number, { foreignTable, referencedTable, }?: {
        foreignTable?: string;
        referencedTable?: string;
    }): this;
    /**
     * Set the AbortSignal for the fetch request.
     *
     * @param signal - The AbortSignal to use for the fetch request
     */
    abortSignal(signal: AbortSignal): this;
    /**
     * Return `data` as a single object instead of an array of objects.
     *
     * Query result must be one row (e.g. using `.limit(1)`), otherwise this
     * returns an error.
     */
    single<ResultOne = Result extends (infer ResultOne)[] ? ResultOne : never>(): PostgrestBuilder<ClientOptions, ResultOne>;
    /**
     * Return `data` as a single object instead of an array of objects.
     *
     * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
     * this returns an error.
     */
    maybeSingle<ResultOne = Result extends (infer ResultOne)[] ? ResultOne : never>(): PostgrestBuilder<ClientOptions, ResultOne | null>;
    /**
     * Return `data` as a string in CSV format.
     */
    csv(): PostgrestBuilder<ClientOptions, string>;
    /**
     * Return `data` as an object in [GeoJSON](https://geojson.org) format.
     */
    geojson(): PostgrestBuilder<ClientOptions, Record<string, unknown>>;
    /**
     * Return `data` as the EXPLAIN plan for the query.
     *
     * You need to enable the
     * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
     * setting before using this method.
     *
     * @param options - Named parameters
     *
     * @param options.analyze - If `true`, the query will be executed and the
     * actual run time will be returned
     *
     * @param options.verbose - If `true`, the query identifier will be returned
     * and `data` will include the output columns of the query
     *
     * @param options.settings - If `true`, include information on configuration
     * parameters that affect query planning
     *
     * @param options.buffers - If `true`, include information on buffer usage
     *
     * @param options.wal - If `true`, include information on WAL record generation
     *
     * @param options.format - The format of the output, can be `"text"` (default)
     * or `"json"`
     */
    explain({ analyze, verbose, settings, buffers, wal, format, }?: {
        analyze?: boolean;
        verbose?: boolean;
        settings?: boolean;
        buffers?: boolean;
        wal?: boolean;
        format?: 'json' | 'text';
    }): PostgrestBuilder<ClientOptions, string, false> | PostgrestBuilder<ClientOptions, Record<string, unknown>[], false>;
    /**
     * Rollback the query.
     *
     * `data` will still be returned, but the query is not committed.
     */
    rollback(): this;
    /**
     * Override the type of the returned `data`.
     *
     * @typeParam NewResult - The new result type to override with
     * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
     */
    returns<NewResult>(): PostgrestTransformBuilder<ClientOptions, Schema, Row, CheckMatchingArrayTypes<Result, NewResult>, RelationName, Relationships, Method>;
    /**
     * Set the maximum number of rows that can be affected by the query.
     * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
     *
     * @param value - The maximum number of rows that can be affected
     */
    maxAffected(value: number): MaxAffectedEnabled<ClientOptions['PostgrestVersion']> extends true ? Method extends 'PATCH' | 'DELETE' | 'RPC' ? this : InvalidMethodError<'maxAffected method only available on update or delete'> : InvalidMethodError<'maxAffected method only available on postgrest 13+'>;
}

declare type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in' | 'cs' | 'cd' | 'sl' | 'sr' | 'nxl' | 'nxr' | 'adj' | 'ov' | 'fts' | 'plfts' | 'phfts' | 'wfts';
declare type IsStringOperator<Path extends string> = Path extends `${string}->>${string}` ? true : false;
declare type ResolveFilterValue<Schema extends GenericSchema$1, Row extends Record<string, unknown>, ColumnName extends string> = ColumnName extends `${infer RelationshipTable}.${infer Remainder}` ? Remainder extends `${infer _}.${infer _}` ? ResolveFilterValue<Schema, Row, Remainder> : ResolveFilterRelationshipValue<Schema, RelationshipTable, Remainder> : ColumnName extends keyof Row ? Row[ColumnName] : IsStringOperator<ColumnName> extends true ? string : JsonPathToType<Row, JsonPathToAccessor<ColumnName>> extends infer JsonPathValue ? JsonPathValue extends never ? never : JsonPathValue : never;
declare type ResolveFilterRelationshipValue<Schema extends GenericSchema$1, RelationshipTable extends string, RelationshipColumn extends string> = Schema['Tables'] & Schema['Views'] extends infer TablesAndViews ? RelationshipTable extends keyof TablesAndViews ? 'Row' extends keyof TablesAndViews[RelationshipTable] ? RelationshipColumn extends keyof TablesAndViews[RelationshipTable]['Row'] ? TablesAndViews[RelationshipTable]['Row'][RelationshipColumn] : unknown : unknown : unknown : never;
declare type InvalidMethodError<S extends string> = {
    Error: S;
};
declare class PostgrestFilterBuilder<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Row extends Record<string, unknown>, Result, RelationName = unknown, Relationships = unknown, Method = unknown> extends PostgrestTransformBuilder<ClientOptions, Schema, Row, Result, RelationName, Relationships, Method> {
    /**
     * Match only rows where `column` is equal to `value`.
     *
     * To check if the value of `column` is NULL, you should use `.is()` instead.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    eq<ColumnName extends string>(column: ColumnName, value: ResolveFilterValue<Schema, Row, ColumnName> extends never ? NonNullable<unknown> : ResolveFilterValue<Schema, Row, ColumnName> extends infer ResolvedFilterValue ? NonNullable<ResolvedFilterValue> : never): this;
    /**
     * Match only rows where `column` is not equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    neq<ColumnName extends string>(column: ColumnName, value: ResolveFilterValue<Schema, Row, ColumnName> extends never ? unknown : ResolveFilterValue<Schema, Row, ColumnName> extends infer ResolvedFilterValue ? ResolvedFilterValue : never): this;
    gt<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    gt(column: string, value: unknown): this;
    gte<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    gte(column: string, value: unknown): this;
    lt<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    lt(column: string, value: unknown): this;
    lte<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    lte(column: string, value: unknown): this;
    like<ColumnName extends string & keyof Row>(column: ColumnName, pattern: string): this;
    like(column: string, pattern: string): this;
    likeAllOf<ColumnName extends string & keyof Row>(column: ColumnName, patterns: readonly string[]): this;
    likeAllOf(column: string, patterns: readonly string[]): this;
    likeAnyOf<ColumnName extends string & keyof Row>(column: ColumnName, patterns: readonly string[]): this;
    likeAnyOf(column: string, patterns: readonly string[]): this;
    ilike<ColumnName extends string & keyof Row>(column: ColumnName, pattern: string): this;
    ilike(column: string, pattern: string): this;
    ilikeAllOf<ColumnName extends string & keyof Row>(column: ColumnName, patterns: readonly string[]): this;
    ilikeAllOf(column: string, patterns: readonly string[]): this;
    ilikeAnyOf<ColumnName extends string & keyof Row>(column: ColumnName, patterns: readonly string[]): this;
    ilikeAnyOf(column: string, patterns: readonly string[]): this;
    is<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName] & (boolean | null)): this;
    is(column: string, value: boolean | null): this;
    /**
     * Match only rows where `column` is included in the `values` array.
     *
     * @param column - The column to filter on
     * @param values - The values array to filter with
     */
    in<ColumnName extends string>(column: ColumnName, values: ReadonlyArray<ResolveFilterValue<Schema, Row, ColumnName> extends never ? unknown : ResolveFilterValue<Schema, Row, ColumnName> extends infer ResolvedFilterValue ? ResolvedFilterValue : never>): this;
    contains<ColumnName extends string & keyof Row>(column: ColumnName, value: string | ReadonlyArray<Row[ColumnName]> | Record<string, unknown>): this;
    contains(column: string, value: string | readonly unknown[] | Record<string, unknown>): this;
    containedBy<ColumnName extends string & keyof Row>(column: ColumnName, value: string | ReadonlyArray<Row[ColumnName]> | Record<string, unknown>): this;
    containedBy(column: string, value: string | readonly unknown[] | Record<string, unknown>): this;
    rangeGt<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeGt(column: string, range: string): this;
    rangeGte<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeGte(column: string, range: string): this;
    rangeLt<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeLt(column: string, range: string): this;
    rangeLte<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeLte(column: string, range: string): this;
    rangeAdjacent<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeAdjacent(column: string, range: string): this;
    overlaps<ColumnName extends string & keyof Row>(column: ColumnName, value: string | ReadonlyArray<Row[ColumnName]>): this;
    overlaps(column: string, value: string | readonly unknown[]): this;
    textSearch<ColumnName extends string & keyof Row>(column: ColumnName, query: string, options?: {
        config?: string;
        type?: 'plain' | 'phrase' | 'websearch';
    }): this;
    textSearch(column: string, query: string, options?: {
        config?: string;
        type?: 'plain' | 'phrase' | 'websearch';
    }): this;
    match<ColumnName extends string & keyof Row>(query: Record<ColumnName, Row[ColumnName]>): this;
    match(query: Record<string, unknown>): this;
    not<ColumnName extends string & keyof Row>(column: ColumnName, operator: FilterOperator, value: Row[ColumnName]): this;
    not(column: string, operator: string, value: unknown): this;
    /**
     * Match only rows which satisfy at least one of the filters.
     *
     * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
     * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
     * to make sure it's properly sanitized.
     *
     * It's currently not possible to do an `.or()` filter across multiple tables.
     *
     * @param filters - The filters to use, following PostgREST syntax
     * @param options - Named parameters
     * @param options.referencedTable - Set this to filter on referenced tables
     * instead of the parent table
     * @param options.foreignTable - Deprecated, use `referencedTable` instead
     */
    or(filters: string, { foreignTable, referencedTable, }?: {
        foreignTable?: string;
        referencedTable?: string;
    }): this;
    filter<ColumnName extends string & keyof Row>(column: ColumnName, operator: `${'' | 'not.'}${FilterOperator}`, value: unknown): this;
    filter(column: string, operator: string, value: unknown): this;
}

declare class PostgrestQueryBuilder<ClientOptions extends ClientServerOptions, Schema extends GenericSchema$1, Relation extends GenericTable$1 | GenericView$1, RelationName = unknown, Relationships = Relation extends {
    Relationships: infer R;
} ? R : unknown> {
    url: URL;
    headers: Headers;
    schema?: string;
    signal?: AbortSignal;
    fetch?: Fetch$3;
    constructor(url: URL, { headers, schema, fetch, }: {
        headers?: HeadersInit;
        schema?: string;
        fetch?: Fetch$3;
    });
    /**
     * Perform a SELECT query on the table or view.
     *
     * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
     *
     * @param options - Named parameters
     *
     * @param options.head - When set to `true`, `data` will not be returned.
     * Useful if you only need the count.
     *
     * @param options.count - Count algorithm to use to count rows in the table or view.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    select<Query extends string = '*', ResultOne = GetResult<Schema, Relation['Row'], RelationName, Relationships, Query, ClientOptions>>(columns?: Query, { head, count, }?: {
        head?: boolean;
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], ResultOne[], RelationName, Relationships, 'GET'>;
    insert<Row extends Relation extends {
        Insert: unknown;
    } ? Relation['Insert'] : never>(values: Row, options?: {
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], null, RelationName, Relationships, 'POST'>;
    insert<Row extends Relation extends {
        Insert: unknown;
    } ? Relation['Insert'] : never>(values: Row[], options?: {
        count?: 'exact' | 'planned' | 'estimated';
        defaultToNull?: boolean;
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], null, RelationName, Relationships, 'POST'>;
    upsert<Row extends Relation extends {
        Insert: unknown;
    } ? Relation['Insert'] : never>(values: Row, options?: {
        onConflict?: string;
        ignoreDuplicates?: boolean;
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], null, RelationName, Relationships, 'POST'>;
    upsert<Row extends Relation extends {
        Insert: unknown;
    } ? Relation['Insert'] : never>(values: Row[], options?: {
        onConflict?: string;
        ignoreDuplicates?: boolean;
        count?: 'exact' | 'planned' | 'estimated';
        defaultToNull?: boolean;
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], null, RelationName, Relationships, 'POST'>;
    /**
     * Perform an UPDATE on the table or view.
     *
     * By default, updated rows are not returned. To return it, chain the call
     * with `.select()` after filters.
     *
     * @param values - The values to update with
     *
     * @param options - Named parameters
     *
     * @param options.count - Count algorithm to use to count updated rows.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    update<Row extends Relation extends {
        Update: unknown;
    } ? Relation['Update'] : never>(values: Row, { count, }?: {
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], null, RelationName, Relationships, 'PATCH'>;
    /**
     * Perform a DELETE on the table or view.
     *
     * By default, deleted rows are not returned. To return it, chain the call
     * with `.select()` after filters.
     *
     * @param options - Named parameters
     *
     * @param options.count - Count algorithm to use to count deleted rows.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    delete({ count, }?: {
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Relation['Row'], null, RelationName, Relationships, 'DELETE'>;
}

/**
 * PostgREST client.
 *
 * @typeParam Database - Types for the schema from the [type
 * generator](https://supabase.com/docs/reference/javascript/next/typescript-support)
 *
 * @typeParam SchemaName - Postgres schema to switch to. Must be a string
 * literal, the same one passed to the constructor. If the schema is not
 * `"public"`, this must be supplied manually.
 */
declare class PostgrestClient<Database = any, ClientOptions extends ClientServerOptions = Database extends {
    __InternalSupabase: infer I extends ClientServerOptions;
} ? I : {}, SchemaName extends string & keyof Omit<Database, '__InternalSupabase'> = 'public' extends keyof Omit<Database, '__InternalSupabase'> ? 'public' : string & keyof Omit<Database, '__InternalSupabase'>, Schema extends GenericSchema$1 = Omit<Database, '__InternalSupabase'>[SchemaName] extends GenericSchema$1 ? Omit<Database, '__InternalSupabase'>[SchemaName] : any> {
    url: string;
    headers: Headers;
    schemaName?: SchemaName;
    fetch?: Fetch$3;
    /**
     * Creates a PostgREST client.
     *
     * @param url - URL of the PostgREST endpoint
     * @param options - Named parameters
     * @param options.headers - Custom headers
     * @param options.schema - Postgres schema to switch to
     * @param options.fetch - Custom fetch
     */
    constructor(url: string, { headers, schema, fetch, }?: {
        headers?: HeadersInit;
        schema?: SchemaName;
        fetch?: Fetch$3;
    });
    from<TableName extends string & keyof Schema['Tables'], Table extends Schema['Tables'][TableName]>(relation: TableName): PostgrestQueryBuilder<ClientOptions, Schema, Table, TableName>;
    from<ViewName extends string & keyof Schema['Views'], View extends Schema['Views'][ViewName]>(relation: ViewName): PostgrestQueryBuilder<ClientOptions, Schema, View, ViewName>;
    /**
     * Select a schema to query or perform an function (rpc) call.
     *
     * The schema needs to be on the list of exposed schemas inside Supabase.
     *
     * @param schema - The schema to query
     */
    schema<DynamicSchema extends string & keyof Omit<Database, '__InternalSupabase'>>(schema: DynamicSchema): PostgrestClient<Database, ClientOptions, DynamicSchema, Database[DynamicSchema] extends GenericSchema$1 ? Database[DynamicSchema] : any>;
    /**
     * Perform a function call.
     *
     * @param fn - The function name to call
     * @param args - The arguments to pass to the function call
     * @param options - Named parameters
     * @param options.head - When set to `true`, `data` will not be returned.
     * Useful if you only need the count.
     * @param options.get - When set to `true`, the function will be called with
     * read-only access mode.
     * @param options.count - Count algorithm to use to count rows returned by the
     * function. Only applicable for [set-returning
     * functions](https://www.postgresql.org/docs/current/functions-srf.html).
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    rpc<FnName extends string & keyof Schema['Functions'], Fn extends Schema['Functions'][FnName]>(fn: FnName, args?: Fn['Args'], { head, get, count, }?: {
        head?: boolean;
        get?: boolean;
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Fn['Returns'] extends any[] ? Fn['Returns'][number] extends Record<string, unknown> ? Fn['Returns'][number] : never : never, Fn['Returns'], FnName, null, 'RPC'>;
}

declare class StorageError extends Error {
    protected __isStorageError: boolean;
    constructor(message: string);
}

declare type BucketType = 'STANDARD' | 'ANALYTICS';
interface Bucket {
    id: string;
    type?: BucketType;
    name: string;
    owner: string;
    file_size_limit?: number;
    allowed_mime_types?: string[];
    created_at: string;
    updated_at: string;
    public: boolean;
}
interface FileObject {
    name: string;
    bucket_id: string;
    owner: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
    buckets: Bucket;
}
interface FileObjectV2 {
    id: string;
    version: string;
    name: string;
    bucket_id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    size?: number;
    cache_control?: string;
    content_type?: string;
    etag?: string;
    last_modified?: string;
    metadata?: Record<string, any>;
}
interface SortBy {
    column?: string;
    order?: string;
}
interface FileOptions {
    /**
     * The number of seconds the asset is cached in the browser and in the Supabase CDN. This is set in the `Cache-Control: max-age=<seconds>` header. Defaults to 3600 seconds.
     */
    cacheControl?: string;
    /**
     * the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
     */
    contentType?: string;
    /**
     * When upsert is set to true, the file is overwritten if it exists. When set to false, an error is thrown if the object already exists. Defaults to false.
     */
    upsert?: boolean;
    /**
     * The duplex option is a string parameter that enables or disables duplex streaming, allowing for both reading and writing data in the same stream. It can be passed as an option to the fetch() method.
     */
    duplex?: string;
    /**
     * The metadata option is an object that allows you to store additional information about the file. This information can be used to filter and search for files. The metadata object can contain any key-value pairs you want to store.
     */
    metadata?: Record<string, any>;
    /**
     * Optionally add extra headers
     */
    headers?: Record<string, string>;
}
interface DestinationOptions {
    destinationBucket?: string;
}
interface SearchOptions {
    /**
     * The number of files you want to be returned.
     * @default 100
     */
    limit?: number;
    /**
     * The starting position.
     */
    offset?: number;
    /**
     * The column to sort by. Can be any column inside a FileObject.
     */
    sortBy?: SortBy;
    /**
     * The search string to filter files by.
     */
    search?: string;
}
interface SearchV2Options {
    limit?: number;
    prefix?: string;
    cursor?: string;
    with_delimiter?: boolean;
}
interface SearchV2Result {
    hasNext: boolean;
    folders: {
        name: string;
    }[];
    objects: FileObject[];
}
interface FetchParameters {
    /**
     * Pass in an AbortController's signal to cancel the request.
     */
    signal?: AbortSignal;
}
interface TransformOptions {
    /**
     * The width of the image in pixels.
     */
    width?: number;
    /**
     * The height of the image in pixels.
     */
    height?: number;
    /**
     * The resize mode can be cover, contain or fill. Defaults to cover.
     * Cover resizes the image to maintain it's aspect ratio while filling the entire width and height.
     * Contain resizes the image to maintain it's aspect ratio while fitting the entire image within the width and height.
     * Fill resizes the image to fill the entire width and height. If the object's aspect ratio does not match the width and height, the image will be stretched to fit.
     */
    resize?: 'cover' | 'contain' | 'fill';
    /**
     * Set the quality of the returned image.
     * A number from 20 to 100, with 100 being the highest quality.
     * Defaults to 80
     */
    quality?: number;
    /**
     * Specify the format of the image requested.
     *
     * When using 'origin' we force the format to be the same as the original image.
     * When this option is not passed in, images are optimized to modern image formats like Webp.
     */
    format?: 'origin';
}
declare type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}` ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}` : S;
declare type Camelize<T> = {
    [K in keyof T as CamelCase<Extract<K, string>>]: T[K];
};
declare type DownloadResult<T> = {
    data: T;
    error: null;
} | {
    data: null;
    error: StorageError;
};

declare type Fetch$2 = typeof fetch;

declare class StreamDownloadBuilder implements PromiseLike<DownloadResult<ReadableStream>> {
    private downloadFn;
    private shouldThrowOnError;
    constructor(downloadFn: () => Promise<Response>, shouldThrowOnError: boolean);
    then<TResult1 = DownloadResult<ReadableStream>, TResult2 = never>(onfulfilled?: ((value: DownloadResult<ReadableStream>) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
    private execute;
}

declare class BlobDownloadBuilder implements PromiseLike<DownloadResult<Blob>> {
    private downloadFn;
    private shouldThrowOnError;
    constructor(downloadFn: () => Promise<Response>, shouldThrowOnError: boolean);
    asStream(): StreamDownloadBuilder;
    then<TResult1 = DownloadResult<Blob>, TResult2 = never>(onfulfilled?: ((value: DownloadResult<Blob>) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
    private execute;
}

declare type FileBody = ArrayBuffer | ArrayBufferView | Blob | Buffer | File | FormData | NodeJS.ReadableStream | ReadableStream<Uint8Array> | URLSearchParams | string;
declare class StorageFileApi {
    protected url: string;
    protected headers: {
        [key: string]: string;
    };
    protected bucketId?: string;
    protected fetch: Fetch$2;
    protected shouldThrowOnError: boolean;
    constructor(url: string, headers?: {
        [key: string]: string;
    }, bucketId?: string, fetch?: Fetch$2);
    /**
     * Enable throwing errors instead of returning them.
     */
    throwOnError(): this;
    /**
     * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
     *
     * @param method HTTP method.
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     */
    private uploadOrUpdate;
    /**
     * Uploads a file to an existing bucket.
     *
     * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     */
    upload(path: string, fileBody: FileBody, fileOptions?: FileOptions): Promise<{
        data: {
            id: string;
            path: string;
            fullPath: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Upload a file with a token generated from `createSignedUploadUrl`.
     * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param token The token generated from `createSignedUploadUrl`
     * @param fileBody The body of the file to be stored in the bucket.
     */
    uploadToSignedUrl(path: string, token: string, fileBody: FileBody, fileOptions?: FileOptions): Promise<{
        data: {
            path: string;
            fullPath: any;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Creates a signed upload URL.
     * Signed upload URLs can be used to upload files to the bucket without further authentication.
     * They are valid for 2 hours.
     * @param path The file path, including the current file name. For example `folder/image.png`.
     * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
     */
    createSignedUploadUrl(path: string, options?: {
        upsert: boolean;
    }): Promise<{
        data: {
            signedUrl: string;
            token: string;
            path: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Replaces an existing file at the specified path with a new one.
     *
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
     * @param fileBody The body of the file to be stored in the bucket.
     */
    update(path: string, fileBody: ArrayBuffer | ArrayBufferView | Blob | Buffer | File | FormData | NodeJS.ReadableStream | ReadableStream<Uint8Array> | URLSearchParams | string, fileOptions?: FileOptions): Promise<{
        data: {
            id: string;
            path: string;
            fullPath: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Moves an existing file to a new path in the same bucket.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
     * @param options The destination options.
     */
    move(fromPath: string, toPath: string, options?: DestinationOptions): Promise<{
        data: {
            message: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Copies an existing file to a new path in the same bucket.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
     * @param options The destination options.
     */
    copy(fromPath: string, toPath: string, options?: DestinationOptions): Promise<{
        data: {
            path: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
     *
     * @param path The file path, including the current file name. For example `folder/image.png`.
     * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
     * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     * @param options.transform Transform the asset before serving it to the client.
     */
    createSignedUrl(path: string, expiresIn: number, options?: {
        download?: string | boolean;
        transform?: TransformOptions;
    }): Promise<{
        data: {
            signedUrl: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
     *
     * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
     * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
     * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     */
    createSignedUrls(paths: string[], expiresIn: number, options?: {
        download: string | boolean;
    }): Promise<{
        data: {
            error: string | null;
            path: string | null;
            signedUrl: string;
        }[];
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
     *
     * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
     * @param options.transform Transform the asset before serving it to the client.
     */
    download<Options extends {
        transform?: TransformOptions;
    }>(path: string, options?: Options): BlobDownloadBuilder;
    /**
     * Retrieves the details of an existing file.
     * @param path
     */
    info(path: string): Promise<{
        data: Camelize<FileObjectV2>;
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Checks the existence of a file.
     * @param path
     */
    exists(path: string): Promise<{
        data: boolean;
        error: null;
    } | {
        data: boolean;
        error: StorageError;
    }>;
    /**
     * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
     * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
     *
     * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
     * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     * @param options.transform Transform the asset before serving it to the client.
     */
    getPublicUrl(path: string, options?: {
        download?: string | boolean;
        transform?: TransformOptions;
    }): {
        data: {
            publicUrl: string;
        };
    };
    /**
     * Deletes files within the same bucket
     *
     * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
     */
    remove(paths: string[]): Promise<{
        data: FileObject[];
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Get file metadata
     * @param id the file id to retrieve metadata
     */
    /**
     * Update file metadata
     * @param id the file id to update metadata
     * @param meta the new file metadata
     */
    /**
     * Lists all the files and folders within a path of the bucket.
     * @param path The folder path.
     * @param options Search options including limit (defaults to 100), offset, sortBy, and search
     */
    list(path?: string, options?: SearchOptions, parameters?: FetchParameters): Promise<{
        data: FileObject[];
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * @experimental this method signature might change in the future
     * @param options search options
     * @param parameters
     */
    listV2(options?: SearchV2Options, parameters?: FetchParameters): Promise<{
        data: SearchV2Result;
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    protected encodeMetadata(metadata: Record<string, any>): string;
    toBase64(data: string): string;
    private _getFinalPath;
    private _removeEmptyFolders;
    private transformOptsToQueryString;
}

declare class StorageBucketApi {
    protected url: string;
    protected headers: {
        [key: string]: string;
    };
    protected fetch: Fetch$2;
    protected shouldThrowOnError: boolean;
    constructor(url: string, headers?: {
        [key: string]: string;
    }, fetch?: Fetch$2, opts?: StorageClientOptions);
    /**
     * Enable throwing errors instead of returning them.
     */
    throwOnError(): this;
    /**
     * Retrieves the details of all Storage buckets within an existing project.
     */
    listBuckets(): Promise<{
        data: Bucket[];
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Retrieves the details of an existing Storage bucket.
     *
     * @param id The unique identifier of the bucket you would like to retrieve.
     */
    getBucket(id: string): Promise<{
        data: Bucket;
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Creates a new Storage bucket
     *
     * @param id A unique identifier for the bucket you are creating.
     * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
     * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
     * The global file size limit takes precedence over this value.
     * The default value is null, which doesn't set a per bucket file size limit.
     * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
     * The default value is null, which allows files with all mime types to be uploaded.
     * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
     * @returns newly created bucket id
     * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
     *   - default bucket type is `STANDARD`
     */
    createBucket(id: string, options?: {
        public: boolean;
        fileSizeLimit?: number | string | null;
        allowedMimeTypes?: string[] | null;
        type?: BucketType;
    }): Promise<{
        data: Pick<Bucket, 'name'>;
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Updates a Storage bucket
     *
     * @param id A unique identifier for the bucket you are updating.
     * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
     * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
     * The global file size limit takes precedence over this value.
     * The default value is null, which doesn't set a per bucket file size limit.
     * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
     * The default value is null, which allows files with all mime types to be uploaded.
     * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
     */
    updateBucket(id: string, options: {
        public: boolean;
        fileSizeLimit?: number | string | null;
        allowedMimeTypes?: string[] | null;
    }): Promise<{
        data: {
            message: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Removes all objects inside a single bucket.
     *
     * @param id The unique identifier of the bucket you would like to empty.
     */
    emptyBucket(id: string): Promise<{
        data: {
            message: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
    /**
     * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
     * You must first `empty()` the bucket.
     *
     * @param id The unique identifier of the bucket you would like to delete.
     */
    deleteBucket(id: string): Promise<{
        data: {
            message: string;
        };
        error: null;
    } | {
        data: null;
        error: StorageError;
    }>;
}

interface StorageClientOptions {
    useNewHostname?: boolean;
}
declare class StorageClient extends StorageBucketApi {
    constructor(url: string, headers?: {
        [key: string]: string;
    }, fetch?: Fetch$2, opts?: StorageClientOptions);
    /**
     * Perform file operation in a bucket.
     *
     * @param id The bucket id to operate on.
     */
    from(id: string): StorageFileApi;
}

declare type AuthClientOptions = ConstructorParameters<typeof AuthClient>[0];
interface SupabaseAuthClientOptions extends AuthClientOptions {
}
declare type Fetch$1 = typeof fetch;
declare type SupabaseClientOptions<SchemaName> = {
    /**
     * The Postgres schema which your tables belong to. Must be on the list of exposed schemas in Supabase. Defaults to `public`.
     */
    db?: {
        schema?: SchemaName;
    };
    auth?: {
        /**
         * Automatically refreshes the token for logged-in users. Defaults to true.
         */
        autoRefreshToken?: boolean;
        /**
         * Optional key name used for storing tokens in local storage.
         */
        storageKey?: string;
        /**
         * Whether to persist a logged-in session to storage. Defaults to true.
         */
        persistSession?: boolean;
        /**
         * Detect a session from the URL. Used for OAuth login callbacks. Defaults to true.
         */
        detectSessionInUrl?: boolean;
        /**
         * A storage provider. Used to store the logged-in session.
         */
        storage?: SupabaseAuthClientOptions['storage'];
        /**
         * A storage provider to store the user profile separately from the session.
         * Useful when you need to store the session information in cookies,
         * without bloating the data with the redundant user object.
         *
         * @experimental
         */
        userStorage?: SupabaseAuthClientOptions['userStorage'];
        /**
         * OAuth flow to use - defaults to implicit flow. PKCE is recommended for mobile and server-side applications.
         */
        flowType?: SupabaseAuthClientOptions['flowType'];
        /**
         * If debug messages for authentication client are emitted. Can be used to inspect the behavior of the library.
         */
        debug?: SupabaseAuthClientOptions['debug'];
        /**
         * Provide your own locking mechanism based on the environment. By default no locking is done at this time.
         *
         * @experimental
         */
        lock?: SupabaseAuthClientOptions['lock'];
    };
    /**
     * Options passed to the realtime-js instance
     */
    realtime?: RealtimeClientOptions;
    storage?: StorageClientOptions;
    global?: {
        /**
         * A custom `fetch` implementation.
         */
        fetch?: Fetch$1;
        /**
         * Optional headers for initializing the client.
         */
        headers?: Record<string, string>;
    };
    /**
     * Optional function for using a third-party authentication system with
     * Supabase. The function should return an access token or ID token (JWT) by
     * obtaining it from the third-party auth client library. Note that this
     * function may be called concurrently and many times. Use memoization and
     * locking techniques if this is not supported by the client libraries.
     *
     * When set, the `auth` namespace of the Supabase client cannot be used.
     * Create another client if you wish to use Supabase Auth and third-party
     * authentications concurrently in the same application.
     */
    accessToken?: () => Promise<string | null>;
};
declare type GenericRelationship = {
    foreignKeyName: string;
    columns: string[];
    isOneToOne?: boolean;
    referencedRelation: string;
    referencedColumns: string[];
};
declare type GenericTable = {
    Row: Record<string, unknown>;
    Insert: Record<string, unknown>;
    Update: Record<string, unknown>;
    Relationships: GenericRelationship[];
};
declare type GenericUpdatableView = GenericTable;
declare type GenericNonUpdatableView = {
    Row: Record<string, unknown>;
    Relationships: GenericRelationship[];
};
declare type GenericView = GenericUpdatableView | GenericNonUpdatableView;
declare type GenericFunction = {
    Args: Record<string, unknown>;
    Returns: unknown;
};
declare type GenericSchema = {
    Tables: Record<string, GenericTable>;
    Views: Record<string, GenericView>;
    Functions: Record<string, GenericFunction>;
};
/**
 * Helper types for query results.
 */
declare type QueryResult<T> = T extends PromiseLike<infer U> ? U : never;
declare type QueryData<T> = T extends PromiseLike<{
    data: infer U;
}> ? Exclude<U, null> : never;
declare type QueryError = PostgrestError;

declare type Fetch = typeof fetch;
/**
 * Response format
 */
interface FunctionsResponseSuccess<T> {
    data: T;
    error: null;
    response?: Response;
}
interface FunctionsResponseFailure {
    data: null;
    error: any;
    response?: Response;
}
declare type FunctionsResponse<T> = FunctionsResponseSuccess<T> | FunctionsResponseFailure;
declare class FunctionsError extends Error {
    context: any;
    constructor(message: string, name?: string, context?: any);
}
declare class FunctionsFetchError extends FunctionsError {
    constructor(context: any);
}
declare class FunctionsRelayError extends FunctionsError {
    constructor(context: any);
}
declare class FunctionsHttpError extends FunctionsError {
    constructor(context: any);
}
declare enum FunctionRegion {
    Any = "any",
    ApNortheast1 = "ap-northeast-1",
    ApNortheast2 = "ap-northeast-2",
    ApSouth1 = "ap-south-1",
    ApSoutheast1 = "ap-southeast-1",
    ApSoutheast2 = "ap-southeast-2",
    CaCentral1 = "ca-central-1",
    EuCentral1 = "eu-central-1",
    EuWest1 = "eu-west-1",
    EuWest2 = "eu-west-2",
    EuWest3 = "eu-west-3",
    SaEast1 = "sa-east-1",
    UsEast1 = "us-east-1",
    UsWest1 = "us-west-1",
    UsWest2 = "us-west-2"
}
declare type FunctionInvokeOptions = {
    /**
     * Object representing the headers to send with the request.
     */
    headers?: {
        [key: string]: string;
    };
    /**
     * The HTTP verb of the request
     */
    method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
    /**
     * The Region to invoke the function in.
     */
    region?: FunctionRegion;
    /**
     * The body of the request.
     */
    body?: File | Blob | ArrayBuffer | FormData | ReadableStream<Uint8Array> | Record<string, any> | string;
    /**
     * The AbortSignal to use for the request.
     * */
    signal?: AbortSignal;
};

declare class FunctionsClient {
    protected url: string;
    protected headers: Record<string, string>;
    protected region: FunctionRegion;
    protected fetch: Fetch;
    constructor(url: string, { headers, customFetch, region, }?: {
        headers?: Record<string, string>;
        customFetch?: Fetch;
        region?: FunctionRegion;
    });
    /**
     * Updates the authorization header
     * @param token - the new jwt token sent in the authorisation header
     */
    setAuth(token: string): void;
    /**
     * Invokes a function
     * @param functionName - The name of the Function to invoke.
     * @param options - Options for invoking the Function.
     */
    invoke<T = any>(functionName: string, options?: FunctionInvokeOptions): Promise<FunctionsResponse<T>>;
}

declare class SupabaseAuthClient extends AuthClient {
    constructor(options: SupabaseAuthClientOptions);
}

/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
declare class SupabaseClient<Database = any, SchemaNameOrClientOptions extends (string & keyof Omit<Database, '__InternalSupabase'>) | {
    PostgrestVersion: string;
} = 'public' extends keyof Omit<Database, '__InternalSupabase'> ? 'public' : string & keyof Omit<Database, '__InternalSupabase'>, SchemaName extends string & keyof Omit<Database, '__InternalSupabase'> = SchemaNameOrClientOptions extends string & keyof Omit<Database, '__InternalSupabase'> ? SchemaNameOrClientOptions : 'public' extends keyof Omit<Database, '__InternalSupabase'> ? 'public' : string & keyof Omit<Omit<Database, '__InternalSupabase'>, '__InternalSupabase'>, Schema extends Omit<Database, '__InternalSupabase'>[SchemaName] extends GenericSchema ? Omit<Database, '__InternalSupabase'>[SchemaName] : never = Omit<Database, '__InternalSupabase'>[SchemaName] extends GenericSchema ? Omit<Database, '__InternalSupabase'>[SchemaName] : never, ClientOptions extends {
    PostgrestVersion: string;
} = SchemaNameOrClientOptions extends string & keyof Omit<Database, '__InternalSupabase'> ? Database extends {
    __InternalSupabase: {
        PostgrestVersion: string;
    };
} ? Database['__InternalSupabase'] : {
    PostgrestVersion: '12';
} : SchemaNameOrClientOptions extends {
    PostgrestVersion: string;
} ? SchemaNameOrClientOptions : never> {
    protected supabaseUrl: string;
    protected supabaseKey: string;
    /**
     * Supabase Auth allows you to create and manage user sessions for access to data that is secured by access policies.
     */
    auth: SupabaseAuthClient;
    realtime: RealtimeClient;
    /**
     * Supabase Storage allows you to manage user-generated content, such as photos or videos.
     */
    storage: StorageClient;
    protected realtimeUrl: URL;
    protected authUrl: URL;
    protected storageUrl: URL;
    protected functionsUrl: URL;
    protected rest: PostgrestClient<Database, ClientOptions, SchemaName>;
    protected storageKey: string;
    protected fetch?: Fetch$1;
    protected changedAccessToken?: string;
    protected accessToken?: () => Promise<string | null>;
    protected headers: Record<string, string>;
    /**
     * Create a new client for use in the browser.
     * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
     * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
     * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
     * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
     * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
     * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
     * @param options.realtime Options passed along to realtime-js constructor.
     * @param options.storage Options passed along to the storage-js constructor.
     * @param options.global.fetch A custom fetch implementation.
     * @param options.global.headers Any additional headers to send with each network request.
     */
    constructor(supabaseUrl: string, supabaseKey: string, options?: SupabaseClientOptions<SchemaName>);
    /**
     * Supabase Functions allows you to deploy and invoke edge functions.
     */
    get functions(): FunctionsClient;
    from<TableName extends string & keyof Schema['Tables'], Table extends Schema['Tables'][TableName]>(relation: TableName): PostgrestQueryBuilder<ClientOptions, Schema, Table, TableName>;
    from<ViewName extends string & keyof Schema['Views'], View extends Schema['Views'][ViewName]>(relation: ViewName): PostgrestQueryBuilder<ClientOptions, Schema, View, ViewName>;
    /**
     * Select a schema to query or perform an function (rpc) call.
     *
     * The schema needs to be on the list of exposed schemas inside Supabase.
     *
     * @param schema - The schema to query
     */
    schema<DynamicSchema extends string & keyof Omit<Database, '__InternalSupabase'>>(schema: DynamicSchema): PostgrestClient<Database, ClientOptions, DynamicSchema, Database[DynamicSchema] extends GenericSchema ? Database[DynamicSchema] : any>;
    /**
     * Perform a function call.
     *
     * @param fn - The function name to call
     * @param args - The arguments to pass to the function call
     * @param options - Named parameters
     * @param options.head - When set to `true`, `data` will not be returned.
     * Useful if you only need the count.
     * @param options.get - When set to `true`, the function will be called with
     * read-only access mode.
     * @param options.count - Count algorithm to use to count rows returned by the
     * function. Only applicable for [set-returning
     * functions](https://www.postgresql.org/docs/current/functions-srf.html).
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    rpc<FnName extends string & keyof Schema['Functions'], Fn extends Schema['Functions'][FnName]>(fn: FnName, args?: Fn['Args'], options?: {
        head?: boolean;
        get?: boolean;
        count?: 'exact' | 'planned' | 'estimated';
    }): PostgrestFilterBuilder<ClientOptions, Schema, Fn['Returns'] extends any[] ? Fn['Returns'][number] extends Record<string, unknown> ? Fn['Returns'][number] : never : never, Fn['Returns'], FnName, null, 'RPC'>;
    /**
     * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
     *
     * @param {string} name - The name of the Realtime channel.
     * @param {Object} opts - The options to pass to the Realtime channel.
     *
     */
    channel(name: string, opts?: RealtimeChannelOptions): RealtimeChannel;
    /**
     * Returns all Realtime channels.
     */
    getChannels(): RealtimeChannel[];
    /**
     * Unsubscribes and removes Realtime channel from Realtime client.
     *
     * @param {RealtimeChannel} channel - The name of the Realtime channel.
     *
     */
    removeChannel(channel: RealtimeChannel): Promise<'ok' | 'timed out' | 'error'>;
    /**
     * Unsubscribes and removes all Realtime channels from Realtime client.
     */
    removeAllChannels(): Promise<('ok' | 'timed out' | 'error')[]>;
    private _getAccessToken;
    private _initSupabaseAuthClient;
    private _initRealtimeClient;
    private _listenForAuthEvents;
    private _handleTokenChanged;
}

/**
 * Creates a new Supabase Client.
 */
declare const createClient: <Database = any, SchemaNameOrClientOptions extends (string & Exclude<keyof Database, "__InternalSupabase">) | {
    PostgrestVersion: string;
} = "public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">, SchemaName extends string & Exclude<keyof Database, "__InternalSupabase"> = SchemaNameOrClientOptions extends string & Exclude<keyof Database, "__InternalSupabase"> ? SchemaNameOrClientOptions : "public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<Exclude<keyof Database, "__InternalSupabase">, "__InternalSupabase">>(supabaseUrl: string, supabaseKey: string, options?: SupabaseClientOptions<SchemaName> | undefined) => SupabaseClient<Database, SchemaNameOrClientOptions, SchemaName, Omit<Database, "__InternalSupabase">[SchemaName] extends GenericSchema ? Omit<Database, "__InternalSupabase">[SchemaName] : never, SchemaNameOrClientOptions extends string & Exclude<keyof Database, "__InternalSupabase"> ? Database extends {
    __InternalSupabase: {
        PostgrestVersion: string;
    };
} ? Database["__InternalSupabase"] : {
    PostgrestVersion: "12";
} : SchemaNameOrClientOptions extends {
    PostgrestVersion: string;
} ? SchemaNameOrClientOptions : never>;

export { AuthAdminApi, AuthApiError, AuthClient, AuthError, AuthImplicitGrantRedirectError, AuthInvalidCredentialsError, AuthInvalidJwtError, AuthInvalidTokenResponseError, AuthPKCEGrantCodeExchangeError, AuthRetryableFetchError, AuthSessionMissingError, AuthUnknownError, AuthWeakPasswordError, CustomAuthError, FunctionRegion, FunctionsError, FunctionsFetchError, FunctionsHttpError, FunctionsRelayError, GoTrueAdminApi, GoTrueClient, NavigatorLockAcquireTimeoutError, PostgrestError, REALTIME_CHANNEL_STATES, REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, REALTIME_PRESENCE_LISTEN_EVENTS, REALTIME_SUBSCRIBE_STATES, RealtimeChannel, RealtimeClient, RealtimePresence, SIGN_OUT_SCOPES, SupabaseClient, WebSocketFactory, createClient, isAuthApiError, isAuthError, isAuthImplicitGrantRedirectError, isAuthRetryableFetchError, isAuthSessionMissingError, isAuthWeakPasswordError, internals as lockInternals, navigatorLock, processLock };
export type { AMREntry, AdminUserAttributes, AuthChangeEvent, AuthChangeEventMFA, AuthFlowType, AuthMFAAdminDeleteFactorParams, AuthMFAAdminDeleteFactorResponse, AuthMFAAdminListFactorsParams, AuthMFAAdminListFactorsResponse, AuthMFAChallengeResponse, AuthMFAEnrollPhoneResponse, AuthMFAEnrollResponse, AuthMFAEnrollTOTPResponse, AuthMFAGetAuthenticatorAssuranceLevelResponse, AuthMFAListFactorsResponse, AuthMFAUnenrollResponse, AuthMFAVerifyResponse, AuthOtpResponse, AuthResponse, AuthResponsePassword, Session as AuthSession, AuthTokenResponse, AuthTokenResponsePassword, User as AuthUser, AuthenticatorAssuranceLevels, CallRefreshTokenResult, EmailOtpType, EthereumWallet, EthereumWeb3Credentials, Factor, FunctionInvokeOptions, GenerateEmailChangeLinkParams, GenerateInviteOrMagiclinkParams, GenerateLinkOptions, GenerateLinkParams, GenerateLinkProperties, GenerateLinkResponse, GenerateLinkType, GenerateRecoveryLinkParams, GenerateSignupLinkParams, GoTrueAdminMFAApi, GoTrueClientOptions, GoTrueMFAApi, InitializeResult, JWK, JwtHeader, JwtPayload, LockFunc, MFAChallengeAndVerifyParams, MFAChallengeParams, MFAEnrollParams, MFAEnrollPhoneParams, MFAEnrollTOTPParams, MFAUnenrollParams, MFAVerifyParams, MobileOtpType, OAuthResponse, PageParams, Pagination, PostgrestMaybeSingleResponse, PostgrestResponse, PostgrestSingleResponse, Provider, QueryData, QueryError, QueryResult, RealtimeChannelOptions, RealtimeChannelSendResponse, RealtimeClientOptions, RealtimeMessage, RealtimePostgresChangesFilter, RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload, RealtimePresenceJoinPayload, RealtimePresenceLeavePayload, RealtimePresenceState, RealtimeRemoveChannelResponse, RequiredClaims, ResendParams, SSOResponse, Session, SignInAnonymouslyCredentials, SignInWithIdTokenCredentials, SignInWithOAuthCredentials, SignInWithPasswordCredentials, SignInWithPasswordlessCredentials, SignInWithSSO, SignOut, SignOutScope, SignUpWithPasswordCredentials, SolanaWallet, SolanaWeb3Credentials, Subscription, SupabaseClientOptions, SupportedStorage, User, UserAppMetadata, UserAttributes, UserIdentity, UserMetadata, UserResponse, VerifyEmailOtpParams, VerifyMobileOtpParams, VerifyOtpParams, VerifyTokenHashParams, WeakPassword, WeakPasswordReasons, Web3Credentials, WebSocketLike, WebSocketLikeConstructor };

type AbortSignal = any;
type BroadcastChannel = any;
type Buffer = any;
type CloseEvent = any;
type Event = any;
type EventListener = any;
type File = any;
type FormData = any;
type MessageEvent = any;
type Storage = any;
type URL = any;
type Worker = any;
interface ReadableStream<R = any> {
}
declare namespace NodeJS {
    interface ReadableStream {
    }
}
import { setTimeout, clearTimeout, setInterval, clearInterval } from './polyfills/timers';
export { setTimeout, clearTimeout, setInterval, clearInterval } from './polyfills/timers';
import { URLSearchParams } from './polyfills/urlsearchparams';
import { fetch } from './polyfills/fetch';
import { HeadersInit } from './polyfills/Headers';