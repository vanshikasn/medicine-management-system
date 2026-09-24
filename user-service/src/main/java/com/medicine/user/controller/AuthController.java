package com.medicine.user.controller;

import com.medicine.user.dto.LoginResponse;
import com.medicine.user.dto.RequestOtpRequest;
import com.medicine.user.dto.VerifyOtpRequest;
import com.medicine.user.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Step 1: request an OTP for a mobile number.
    // Always returns 200 (unknown numbers are auto-created as customers).
    @PostMapping("/request-otp")
    public ResponseEntity<Void> requestOtp(@Valid @RequestBody RequestOtpRequest request) {
        authService.requestOtp(request.getMobileNumber());
        return ResponseEntity.ok().build();
    }

    // Step 2: verify the OTP. On success -> 200 with { token, role }.
    // On wrong OTP -> 401 Unauthorized.
    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return authService.verifyOtp(request.getMobileNumber(), request.getOtp())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
