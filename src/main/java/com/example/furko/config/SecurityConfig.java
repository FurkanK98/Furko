package com.example.furko.config;

import com.example.furko.utils.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF deaktivieren, damit Postman meine Tests nicht blockiert.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login").permitAll() // Login darf jeder aufrufen. (Kein Token nötig)
                        .requestMatchers("/api/**").authenticated() // Alle anderen Endpoints nur mit gültigen Token zugreifbar.
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // JWT-Filter wird VOR dem Standard-Auth-Filter ausgeführt.

        return http.build();
    }
}