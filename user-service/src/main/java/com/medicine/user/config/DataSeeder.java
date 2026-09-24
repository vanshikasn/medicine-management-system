package com.medicine.user.config;

import com.medicine.user.model.User;
import com.medicine.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Ensures the single owner account exists on startup.
//
// Needed because a fresh database (e.g. the one Render creates in the cloud)
// starts empty. Without this, logging in with the owner's number would
// auto-create it as a ROLE_CUSTOMER and there would be no owner.
//
// This runs on every startup but is idempotent: if the owner already exists,
// it does nothing (so it's harmless on databases that already have the row).
@Configuration
public class DataSeeder {

    private static final String ROLE_OWNER = "ROLE_OWNER";

    @Bean
    public CommandLineRunner seedOwner(
            UserRepository userRepository,
            @Value("${app.owner.mobile-number:1234567890}") String ownerMobile) {
        return args -> {
            userRepository.findByMobileNumber(ownerMobile)
                    .ifPresentOrElse(
                            existing -> {
                                // Guarantee the seeded number always has the owner role.
                                if (!ROLE_OWNER.equals(existing.getRole())) {
                                    existing.setRole(ROLE_OWNER);
                                    userRepository.save(existing);
                                }
                            },
                            () -> {
                                User owner = new User();
                                owner.setMobileNumber(ownerMobile);
                                owner.setRole(ROLE_OWNER);
                                userRepository.save(owner);
                            });
        };
    }
}
