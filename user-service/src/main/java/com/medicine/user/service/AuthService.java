package com.medicine.user.service;

import com.medicine.user.dto.LoginResponse;
import com.medicine.user.model.User;
import com.medicine.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

// Business logic for OTP-based login.
@Service
public class AuthService {

    private static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final String devOtp; // fixed OTP in dev (no real SMS)

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       @Value("${app.otp.dev-code}") String devOtp) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.devOtp = devOtp;
    }

    // Request an OTP for a mobile number.
    // Unknown numbers are auto-created as ROLE_CUSTOMER (owner is pre-seeded).
    // In dev, we don't send SMS; the OTP is a fixed value (logged for testing).
    public void requestOtp(String mobileNumber) {
        userRepository.findByMobileNumber(mobileNumber)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setMobileNumber(mobileNumber);
                    newUser.setRole(ROLE_CUSTOMER);
                    return userRepository.save(newUser);
                });

        // In dev: pretend to send the OTP. Real SMS is future work.
        System.out.println("DEV OTP for " + mobileNumber + " is: " + devOtp);
    }

    // Verify the OTP. If correct, return a signed token + the user's role.
    // Returns empty if the OTP is wrong or the user somehow doesn't exist.
    public Optional<LoginResponse> verifyOtp(String mobileNumber, String otp) {
        if (!devOtp.equals(otp)) {
            return Optional.empty(); // wrong OTP
        }

        return userRepository.findByMobileNumber(mobileNumber)
                .map(user -> {
                    String token = jwtService.generateToken(user.getMobileNumber(), user.getRole());
                    return new LoginResponse(token, user.getRole());
                });
    }
}
