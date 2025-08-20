package com.example.furko.repository;

import com.example.furko.entity.Invoice;
import com.example.furko.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoice(Invoice invoice); // Alle Zahlungen zu einer Rechnung
}