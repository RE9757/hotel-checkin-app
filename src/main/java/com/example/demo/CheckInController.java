package com.example.demo;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CheckInController {

    @Autowired
    private CheckInRecordRepository repository;

    @PostMapping("/checkin")
    public ResponseEntity<?> save(@Valid @RequestBody CheckInRecord record) {
        List<CheckInRecord> conflicts = repository.findConflictingBookings(
                record.getRoomNumber(),
                record.getCheckInDate(),
                record.getCheckOutDate()
        );

        if (!conflicts.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Room " + record.getRoomNumber() + " is already booked during this period.");
        }

        CheckInRecord saved = repository.save(record);
        return ResponseEntity.ok(saved);
    }

    // query all checkIn records
    @GetMapping("/checkins")
    public List<CheckInRecord> getAll() {
        return repository.findAll();
    }

}
