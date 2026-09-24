package com.medicine.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// Returned by POST /api/auth/verify-otp on success.
@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private String token; // the signed JWT the client will send on protected requests
    private String role;  // e.g. ROLE_OWNER or ROLE_CUSTOMER (so the UI can adapt)
}
