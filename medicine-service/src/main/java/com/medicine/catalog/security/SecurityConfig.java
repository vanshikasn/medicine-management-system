package com.medicine.catalog.security;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // We use stateless JWT auth, so disable CSRF (which targets session-based apps).
                .csrf(AbstractHttpConfigurer::disable)
                // No server-side sessions; each request is authenticated by its token.
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // The access rules:
                .authorizeHttpRequests(auth -> auth
                        // Allow internal error dispatches (e.g. the /error forward that Spring
                        // performs after a 400/404) so they aren't re-evaluated and turned into 403.
                        .dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                        // Health check endpoint must be public so the platform (Render) can
                        // poll it without a token.
                        .requestMatchers("/actuator/health").permitAll()
                        // Reading medicines is public (any GET under /api/medicines).
                        .requestMatchers(HttpMethod.GET, "/api/medicines/**").permitAll()
                        // Creating/updating/deleting requires the OWNER role.
                        .requestMatchers(HttpMethod.POST, "/api/medicines/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT, "/api/medicines/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/api/medicines/**").hasRole("OWNER")
                        // Anything else must be authenticated.
                        .anyRequest().authenticated()
                )
                // When an unauthenticated (no/invalid token) caller hits a protected
                // endpoint, return 401 Unauthorized instead of the default 403.
                // A valid token with the wrong role still results in 403 (access denied).
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                // Run our JWT filter before Spring's username/password filter so that
                // the token is read and the user is set as authenticated first.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
