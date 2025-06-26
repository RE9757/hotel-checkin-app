package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface CheckInRecordRepository extends JpaRepository<CheckInRecord, Long> {

    //query whether the roomNumber chosen already booked by other customer
    @Query("SELECT r FROM CheckInRecord r WHERE r.roomNumber = :roomNumber " +
            "AND :checkInDate < r.checkOutDate " +
            "AND :checkOutDate > r.checkInDate")
    List<CheckInRecord> findConflictingBookings(Integer roomNumber, LocalDate checkInDate, LocalDate checkOutDate);
}