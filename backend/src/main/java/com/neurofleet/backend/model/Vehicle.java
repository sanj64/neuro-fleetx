package com.neurofleet.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Column(nullable = false)
    private String type; // e.g., Car, Truck, Bike

    @Column(nullable = false)
    private String status; // ACTIVE, IN_MAINTENANCE, CHARGING

    @Column(nullable = false)
    private int fuelLevel; // in percentage

    @Column(nullable = false)
    private int batteryLevel; // in percentage, for electric vehicles

    private LocalDate lastMaintenanceDate;

    // Constructors
    public Vehicle() {}

    public Vehicle(String vehicleNumber, String type, String status, int fuelLevel, int batteryLevel, LocalDate lastMaintenanceDate) {
        this.vehicleNumber = vehicleNumber;
        this.type = type;
        this.status = status;
        this.fuelLevel = fuelLevel;
        this.batteryLevel = batteryLevel;
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(int fuelLevel) { this.fuelLevel = fuelLevel; }

    public int getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(int batteryLevel) { this.batteryLevel = batteryLevel; }

    public LocalDate getLastMaintenanceDate() { return lastMaintenanceDate; }
    public void setLastMaintenanceDate(LocalDate lastMaintenanceDate) { this.lastMaintenanceDate = lastMaintenanceDate; }
}