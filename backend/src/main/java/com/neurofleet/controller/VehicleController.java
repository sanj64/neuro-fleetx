package com.neurofleet.backend.controller;

import com.neurofleet.backend.model.Vehicle;
import com.neurofleet.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle updatedVehicle) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setVehicleNumber(updatedVehicle.getVehicleNumber());
                    vehicle.setType(updatedVehicle.getType());
                    vehicle.setStatus(updatedVehicle.getStatus());
                    vehicle.setFuelLevel(updatedVehicle.getFuelLevel());
                    vehicle.setBatteryLevel(updatedVehicle.getBatteryLevel());
                    vehicle.setLastMaintenanceDate(updatedVehicle.getLastMaintenanceDate());
                    return vehicleRepository.save(vehicle);
                }).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        vehicleRepository.deleteById(id);
        return "Vehicle deleted successfully";
    }
}