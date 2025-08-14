package com.example.furko.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF deaktivieren für Postman & Co.
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().permitAll() // Alles erlauben
            )
                .httpBasic(); // Aktiviert Basic Auth

        return http.build();
    }

/* Deaktivieren der Sicherheitseinschränkungen
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF deaktivieren für Postman & Co.
            .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll() // Alles erlauben
            )
            .httpBasic(Customizer.withDefaults()); // Optional: Basic Auth aktivieren (nicht notwendig hier)

        return http.build();
    }*/
}