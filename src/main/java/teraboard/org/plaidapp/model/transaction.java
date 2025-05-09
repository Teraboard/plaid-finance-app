package teraboard.org.plaidapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;


@Document(collection = "transactions")
public class Transaction {


    @Id
    private String id;
    private String transactionId; // Plaid transaction ID
    private String plaidItemId; // Reference to the Plaid item
    private String name;
    private String merchantName; // Store merchant name if available
    private String date;
    private Double amount;
    private TransactionCategory category;
    private Boolean pending; // Whether the transaction is pending
    private String originalCategories; // Original Plaid categories    // Default constructor needed for MongoDB
    public Transaction() {
    }
    
    // Constructor with all fields for easier creation and testing
    @JsonCreator
    public Transaction(
        @JsonProperty("id") String id, 
        @JsonProperty("transactionId") String transactionId,
        @JsonProperty("plaidItemId") String plaidItemId,
        @JsonProperty("name") String name, 
        @JsonProperty("merchantName") String merchantName,
        @JsonProperty("date") String date, 
        @JsonProperty("amount") Double amount, 
        @JsonProperty("category") TransactionCategory category,
        @JsonProperty("pending") Boolean pending,
        @JsonProperty("originalCategories") String originalCategories) {
        this.id = id;
        this.transactionId = transactionId;
        this.plaidItemId = plaidItemId;
        this.name = name;
        this.merchantName = merchantName;
        this.date = date;
        this.amount = amount;
        this.category = category;
        this.pending = pending;
        this.originalCategories = originalCategories;
    }    // Getters
    public String getId() {
        return id;
    }
    public String getTransactionId() {
        return transactionId;
    }
    public String getPlaidItemId() {
        return plaidItemId;
    }
    public String getName() {
        return name;
    }
    public String getMerchantName() {
        return merchantName;
    }
    public String getDate() {
        return date;
    }
    public Double getAmount() {
        return amount;
    }
    public TransactionCategory getCategory() {
        return category;
    }
    public Boolean getPending() {
        return pending;
    }
    public String getOriginalCategories() {
        return originalCategories;
    }
    // Setters
    public void setId(String id) {
        this.id = id;
    }
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    public void setPlaidItemId(String plaidItemId) {
        this.plaidItemId = plaidItemId;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    public void setCategory(TransactionCategory category) {
        this.category = category;
    }
    public void setPending(Boolean pending) {
        this.pending = pending;
    }
    public void setOriginalCategories(String originalCategories) {
        this.originalCategories = originalCategories;
    }
      @Override
    public String toString() {
        return "Transaction{" +
                "id='" + id + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", plaidItemId='" + plaidItemId + '\'' +
                ", name='" + name + '\'' +
                ", merchantName='" + merchantName + '\'' +
                ", date='" + date + '\'' +
                ", amount=" + amount +
                ", category=" + category +
                ", pending=" + pending +
                ", originalCategories='" + originalCategories + '\'' +
                '}';
    }
}
