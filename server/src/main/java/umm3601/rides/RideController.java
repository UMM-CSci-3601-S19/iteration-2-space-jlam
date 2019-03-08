package umm3601.rides;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;


/**
 * Controller that manages requests for info about users.
 */
public class RideController {

  private final MongoCollection<Document> rideCollection;

  /**
   * Construct a controller for users.
   *
   * @param database the database containing user data
   */
  public RideController(MongoDatabase database) {
    rideCollection = database.getCollection("rides");
  }

  /**
   * Helper method that gets a single ride specified by the `id`
   * parameter in the request.
   *
   * @param id the Mongo ID of the desired ride
   * @return the desired user as a JSON object if the user with that ID is found,
   * and `null` if no user with that ID is found
   */
  public String getRide(String id) {
    FindIterable<Document> jsonRides
      = rideCollection
      .find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonRides.iterator();
    if (iterator.hasNext()) {
      Document ride = iterator.next();
      return ride.toJson();
    } else {
      // We didn't find the desired ride
      return null;
    }
  }


  /**
   * Helper method which iterates through the collection, receiving all
   * documents if no query parameter is specified. If the age query parameter
   * is specified, then the collection is filtered so only documents of that
   * specified age are found.
   *
   * @param queryParams the query parameters from the request
   * @return an array of Users in a JSON formatted string
   */
  public String getRides(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("destination")) {
      String targetDestination = (queryParams.get("destination")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetDestination);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("destination", contentRegQuery);
    }

    if (queryParams.containsKey("vehicle")) {
      String targetContent = (queryParams.get("vehicle")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("vehicle", contentRegQuery);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);

    return serializeIterable(matchingRides);
  }

  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }


  /**
   * Helper method which appends received user information to the to-be added document

   */
  public String addNewRide(String vehicle, int mileage, String condition, String start_location, String destination) {

    Document newRide = new Document();
    newRide.append("vehicle", vehicle);
    newRide.append("mileage", mileage);
    newRide.append("condition", condition);
    newRide.append("start_location", start_location);
    newRide.append("destination", destination);

    try {
      rideCollection.insertOne(newRide);
      ObjectId id = newRide.getObjectId("_id");
      System.err.println("Successfully added new ride [_id=" + id + ", vehicle=" + vehicle + ", mileage=" + mileage
        + " condition=" + condition + " start_location=" + start_location + "destination=" + destination + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }

  public String addEditedRide(String _id, String vehicle, int mileage, String condition, String start_location, String destination) {

    Document oldRide = new Document();
    oldRide.append(getRide(_id), vehicle);
    oldRide.append("mileage", mileage);
    oldRide.append("condition", condition);
    oldRide.append("start_location", start_location);
    oldRide.append("destination", destination);

    try {
      rideCollection.insertOne(oldRide);
      ObjectId id = oldRide.getObjectId("_id");
      System.err.println("Successfully added edited ride [_id=" + id + ", vehicle=" + vehicle + ", mileage=" + mileage
        + " condition=" + condition + " start_location=" + start_location + "destination=" + destination + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}

