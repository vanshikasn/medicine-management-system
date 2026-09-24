package com.medicine.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// Body for POST /api/auth/request-otp
@Getter
@Setter
public class RequestOtpRequest {

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;
}
