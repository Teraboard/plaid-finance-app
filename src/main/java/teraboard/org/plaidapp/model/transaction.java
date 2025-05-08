package teraboard.org.plaidapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;


@Document(collection = "transactions")
public class Transaction {


    @Id
    private String id;
    private String name;
    private String date;
    private Double amount;
    private TransactionCategory category;

    // Default constructor needed for MongoDB
    public Transaction() {
    }
    
    // Constructor with all fields for easier creation and testing
    @JsonCreator
    public Transaction(
        @JsonProperty("id") String id, 
        @JsonProperty("name") String name, 
        @JsonProperty("date") String date, 
        @JsonProperty("amount") Double amount, 
        @JsonProperty("category") TransactionCategory category) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.amount = amount;
        this.category = category;
    }

    // Getters
    public String getId() {
        return id;
    }
    public String getName() {
        return name;
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


    // Setters
    public void setId(String id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
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
    
    @Override
    public String toString() {
        return "Transaction{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", date='" + date + '\'' +
                ", amount=" + amount +
                ", category=" + category +
                '}';
    }
}
