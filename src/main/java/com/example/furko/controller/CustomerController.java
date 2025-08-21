package com.example.furko.controller;

import com.example.furko.dto.CustomerDTO;
import com.example.furko.entity.Customer;
import com.example.furko.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Kundenverwaltung", description = "CRUD für Kunden")
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Alle Kunden anzeigen", description = "Gibt alle Kunden in einer Liste aus")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste erfolgreich geladen", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerDTO.class))),
            @ApiResponse(responseCode = "401", description = "Nicht autorisiert")
    })
    public ResponseEntity<String> getAllCustomers() {
        return ResponseEntity.ok("Alle Kunden (sichtbar für ROLE_USER und ROLE_ADMIN");
    }

    @GetMapping("/admin")
    public ResponseEntity<String> getAdminData() {
        return ResponseEntity.ok("Nur sichtbar für ROLE_ADMIN!");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Kunde anzeigen", description = "Findet einen Kunden anhand seiner Nummer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Kunde gefunden", content = @Content(schema = @Schema(implementation = CustomerDTO.class))),
            @ApiResponse(responseCode = "404", description = "Kunde nicht gefunden")
    })
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Kunde anlegen", description = "Legt einen neuen Kunden im System an")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Kunde erfolgreich angelegt"),
            @ApiResponse(responseCode = "400", description = "Ungültigte Eingabe"),
            @ApiResponse(responseCode = "401", description = "Nicht autorisiert"),
            @ApiResponse(responseCode = "500", description = "Interner Serverfehler")
    })
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) {

        Customer customer = Customer.builder()
                .name(customerDTO.getName())
                .email(customerDTO.getEmail())
                .phoneNumber(customerDTO.getPhoneNumber())
                .address(customerDTO.getAddress())
                .build();

        return ResponseEntity.ok(customerService.saveCustomer(customer));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Kunde aktualisieren", description = "Aktualisiert die Daten eines bestehenden Kunden")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Kunde erfolgreich aktualisiert"),
            @ApiResponse(responseCode = "404", description = "Kunde nicht gefunden")
    })
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDTO customerDTO) {

        Customer updated = Customer.builder()
                .name(customerDTO.getName())
                .email(customerDTO.getEmail())
                .phoneNumber(customerDTO.getPhoneNumber())
                .address(customerDTO.getAddress())
                .build();

        return ResponseEntity.ok(customerService.updateCustomer(id, updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Kunde löschen", description = "Löscht einen Kunden anhand der ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Kunde erfolgreich gelöscht"),
            @ApiResponse(responseCode = "404", description = "Kunde nicht gefunden")
    })
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}