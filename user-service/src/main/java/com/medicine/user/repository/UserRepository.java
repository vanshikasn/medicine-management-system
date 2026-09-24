package com.medicine.user.repository;

import com.medicine.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their mobile number (used for login).
    // Returns Optional because the number may not exist.
    Optional<User> findByMobileNumber(String mobileNumber);
}
