package com.example.furko.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private double amount;
    private String status;

    @ManyToOne
    @JoinColumn(name = "customer_id") // Fremdschlüssel
    private Customer customer;
}