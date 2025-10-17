package com.example.furko.service;

import com.example.furko.entity.Invoice;
import com.example.furko.entity.Payment;
import com.example.furko.repository.InvoiceRepository;
import com.example.furko.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public Payment createPayment(Long invoiceID, Double amount, String method) {
        Invoice invoice = invoiceRepository.findById(invoiceID)
                .orElseThrow(() -> new RuntimeException("Rechnung nicht gefunden!"));

        // Zahlung erstellen
        Payment payment = Payment.builder()
                .amount(amount)
                .method(method)
                .invoice(invoice)
                .build();

        // Status der Rechnung auf "PAID" setzen, wenn der Betrag passt
        if (amount >= invoice.getAmount()) {
            invoice.setStatus("PAID");
            invoiceRepository.save(invoice);
        }
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByInvoice(Long invoiceID) {
        Invoice invoice = invoiceRepository.findById(invoiceID)
                .orElseThrow(() -> new RuntimeException("Rechnung wurde nicht gefunden!"));

        return paymentRepository.findByInvoice(invoice);
    }

    public Payment getPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zahlungsnr. " + id + " wurde nicht gefunden!"));
    }

    public void deletePayment(Long id) {
        if(!paymentRepository.existsById(id)) {
            throw new RuntimeException("Zahlungsnr. " + id + "wurde nicht gefunden!");
        }
        paymentRepository.deleteById(id);
    }
}
