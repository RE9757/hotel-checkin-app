package com.example.demo;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkin")
public class CheckInRecordController {

    private final CheckInRecordRepository repository;

    public CheckInRecordController(CheckInRecordRepository repository) {
        this.repository = repository;
    }

    // query all checkIn records, listed by date
    @GetMapping("/records")
    public List<CheckInRecord> getAllRecords() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "checkInDate"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CheckInRecord> updateCheckIn(
            @PathVariable Long id,
            @RequestBody CheckInRecord updatedRecord) {

        return repository.findById(id)
                .map(record -> {
                    record.setName(updatedRecord.getName());
                    record.setRoomNumber(updatedRecord.getRoomNumber());
                    record.setCheckInDate(updatedRecord.getCheckInDate());
                    record.setCheckOutDate(updatedRecord.getCheckOutDate());
                    record.setPrice(updatedRecord.getPrice());
                    record.setNotes(updatedRecord.getNotes());
                    return ResponseEntity.ok(repository.save(record));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckIn(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}


