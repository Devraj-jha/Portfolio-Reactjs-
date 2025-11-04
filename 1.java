import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class PrintDate {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        System.out.println("Today's date: " + today.format(formatter));
    }
}