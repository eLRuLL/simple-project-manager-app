// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-axios';
import type { GetApiProjectsData, GetApiProjectsResponse, PostApiProjectsData, PostApiProjectsResponse, PutApiProjectsByIdData, PutApiProjectsByIdResponse, GetApiUsersData, GetApiUsersResponse } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Returns all projects
 */
export const getApiProjects = <ThrowOnError extends boolean = false>(options?: Options<GetApiProjectsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetApiProjectsResponse, unknown, ThrowOnError>({
        url: '/api/projects',
        ...options
    });
};

/**
 * Create a new project
 */
export const postApiProjects = <ThrowOnError extends boolean = false>(options: Options<PostApiProjectsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<PostApiProjectsResponse, unknown, ThrowOnError>({
        url: '/api/projects',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Update a project
 */
export const putApiProjectsById = <ThrowOnError extends boolean = false>(options: Options<PutApiProjectsByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<PutApiProjectsByIdResponse, unknown, ThrowOnError>({
        url: '/api/projects/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Returns all users
 */
export const getApiUsers = <ThrowOnError extends boolean = false>(options?: Options<GetApiUsersData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetApiUsersResponse, unknown, ThrowOnError>({
        url: '/api/users',
        ...options
    });
};