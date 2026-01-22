<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Hash Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default hash driver that will be used to hash
    | passwords for your application. By default, the bcrypt algorithm is
    | used; however, you remain free to modify this option if you wish.
    |
    | Supported: "bcrypt", "argon", "argon2id"
    |
    */

    'driver' => env('HASH_DRIVER', 'argon2id'),

    /*
    |--------------------------------------------------------------------------
    | Bcrypt Options
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | passwords are hashed using the Bcrypt algorithm. This will allow you
    | to control the amount of time it takes to hash the given password.
    |
    */

    'bcrypt' => [
        'rounds' => env('BCRYPT_ROUNDS', 12),
    ],

    /*
    |--------------------------------------------------------------------------
    | Argon Options
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | passwords are hashed using the Argon algorithm. These will allow you
    | to control the amount of time it takes to hash the given password.
    |
    */

    'argon' => [
        'memory' => 65536,
        'threads' => 4,
        'time' => 4,
    ],

    /*
    |--------------------------------------------------------------------------
    | Argon2id Options
    |--------------------------------------------------------------------------
    |
    | Argon2id is the most secure variant of Argon2. It provides the best
    | protection against both side-channel and GPU-based attacks.
    |
    */

    'argon2id' => [
        'memory' => env('ARGON2ID_MEMORY', 65536), // 64 MB
        'threads' => env('ARGON2ID_THREADS', 4),
        'time' => env('ARGON2ID_TIME', 4), // Higher = more secure but slower
    ],

];
