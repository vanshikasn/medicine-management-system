package com.medicine.user.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// Creates signed JWT tokens after a successful login.
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        // Build a signing key from the shared secret string.
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // Build a token that identifies the user (subject = mobile number)
    // and carries their role. Signed so it can't be tampered with.
    public String generateToken(String mobileNumber, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(mobileNumber)     // "who" the token is for
                .claim("role", role)        // extra info: their role
                .issuedAt(now)
                .expiration(expiry)         // when it stops being valid
                .signWith(key)              // sign with the secret key
                .compact();                 // produce the final token string
    }
}
