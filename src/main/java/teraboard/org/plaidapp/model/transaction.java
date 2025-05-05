package teraboard.org.plaidapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "transactions")
public class transaction {


    @Id
    private String id;
    private String name;
    private String date;
    private Double amount;
    private TransactionCategory category;

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
}
