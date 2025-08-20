package com.example.furko.config;

import com.example.furko.utils.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF deaktivieren, damit Postman meine Tests nicht blockiert.
                .authorizeHttpRequests(auth -> auth
                        // Login
                        .requestMatchers("/api/login").permitAll() // Login darf jeder aufrufen. (Kein Token nötig)

                        // Kundenverwaltung
                        .requestMatchers("/api/customers/**").hasRole("ADMIN")

                        // Rechnungen
                        .requestMatchers(HttpMethod.GET, "/api/invoices/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/invoices/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/invoices/**").hasRole("ADMIN")

                        // Zahlungen
                        .requestMatchers("/api/payments/**").hasAnyRole("ADMIN", "USER")

                        // Alle andere für alle eingeloggten User
                        .requestMatchers("/api/**").authenticated() // Alle anderen Endpoints nur mit gültigen Token zugreifbar.
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // JWT-Filter wird VOR dem Standard-Auth-Filter ausgeführt.

        return http.build();
    }
}