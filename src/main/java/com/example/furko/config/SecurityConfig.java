package com.example.furko.config;

import com.example.furko.utils.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Preflight erlauben
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Swagger/OpenAPI - freier Zugang
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/webjars/**",
                                "/configuration/**"
                        ).permitAll()

                        // Login darf jeder aufrufen. (Kein Token nötig)
                        .requestMatchers("/api/login").permitAll()
//                        .anyRequest().authenticated()

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
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        System.out.println(">>> CORS Config ist aktiv!");
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOriginPatterns(List.of("http://localhost:5173")); // React-Frontend
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        cors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}