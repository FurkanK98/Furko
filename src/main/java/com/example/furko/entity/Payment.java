package com.example.furko.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private String method; // Zahlungsmethode

    @ManyToOne
    @JoinColumn(name = "invoice_id") // Fremdschlüssel
    private Invoice invoice; // Zugehörige Rechnung
}