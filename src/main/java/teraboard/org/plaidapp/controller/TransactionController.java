package teraboard.org.plaidapp.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import teraboard.org.plaidapp.model.Transaction;
import teraboard.org.plaidapp.repository.TransactionRepository;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionRepository repository;

    @GetMapping
    public ResponseEntity<?> getAllTransactions() {
        try {
            logger.info("GET /api/transactions - Fetching all transactions");
            
            // Debug MongoDB connection
            logger.debug("Database connection test - Repository: {}", repository);
            
            List<Transaction> transactions = repository.findAll();
            logger.info("Found {} transactions in database", transactions.size());
            
            // Enhanced logging - log each transaction more thoroughly
            for (Transaction t : transactions) {
                // Format amount to always have 2 decimal places
                if (t.getAmount() != null) {
                    double roundedAmount = new BigDecimal(t.getAmount())
                        .setScale(2, RoundingMode.HALF_UP)
                        .doubleValue();
                    t.setAmount(roundedAmount);
                }
                
                logger.debug("Transaction details: id={}, name={}, amount={}, date={}, category={}", 
                    t.getId(), 
                    t.getName(), 
                    t.getAmount(), 
                    t.getDate(), 
                    (t.getCategory() != null ? t.getCategory().name() : "null"));
            }
            
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching transactions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching transactions: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody Transaction transaction) {
        try {
            logger.info("POST /api/transactions - Creating transaction: {}", transaction);
            
            // Ensure amount is always rounded to 2 decimal places
            if (transaction.getAmount() != null) {
                double roundedAmount = new BigDecimal(transaction.getAmount())
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
                transaction.setAmount(roundedAmount);
            }
            
            // Log transaction fields explicitly for debugging
            logger.debug("Transaction to save: name={}, amount={}, date={}, category={}", 
                transaction.getName(), 
                transaction.getAmount(), 
                transaction.getDate(), 
                (transaction.getCategory() != null ? transaction.getCategory().name() : "null"));
            
            Transaction saved = repository.save(transaction);
            logger.info("Transaction saved successfully with id: {}", saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            logger.error("Error creating transaction", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating transaction: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable String id) {
        try {
            logger.info("DELETE /api/transactions/{} - Deleting transaction", id);
            
            if (!repository.existsById(id)) {
                logger.warn("Transaction with id {} not found", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Transaction not found with id: " + id);
            }
            
            repository.deleteById(id);
            logger.info("Transaction deleted successfully with id: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting transaction with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting transaction: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable String id, @RequestBody Transaction transaction) {
        try {
            logger.info("PUT /api/transactions/{} - Updating transaction", id);
            
            // Check if transaction exists
            Optional<Transaction> existingTransaction = repository.findById(id);
            if (!existingTransaction.isPresent()) {
                logger.warn("Transaction with id {} not found", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Transaction not found with id: " + id);
            }
            
            // Set the ID to ensure we're updating the correct record
            transaction.setId(id);
            
            // Ensure amount is always rounded to 2 decimal places
            if (transaction.getAmount() != null) {
                double roundedAmount = new BigDecimal(transaction.getAmount())
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
                transaction.setAmount(roundedAmount);
            }
            
            // Log transaction fields explicitly for debugging
            logger.debug("Transaction to update: id={}, name={}, amount={}, date={}, category={}", 
                transaction.getId(), 
                transaction.getName(), 
                transaction.getAmount(), 
                transaction.getDate(), 
                (transaction.getCategory() != null ? transaction.getCategory().name() : "null"));
            
            Transaction updated = repository.save(transaction);
            logger.info("Transaction updated successfully with id: {}", updated.getId());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating transaction with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating transaction: " + e.getMessage());
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        logger.error("Unhandled exception in TransactionController", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred: " + e.getMessage());
    }
}