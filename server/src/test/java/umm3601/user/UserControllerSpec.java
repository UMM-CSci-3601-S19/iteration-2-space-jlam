package umm3601.user;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the UserController.
 * <p>
 * Created by mcphee on 22/2/17.
 */
public class UserControllerSpec {
  private UserController userController;
  private ObjectId samsId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(Document.parse("{\n" +
      "                    name: \"Chris\",\n" +
      "                    phone: \"2543689548\",\n" +
      "                    vehicle: \"Ford\",\n" +
      "                    email: \"chris@this.that\"\n" +
      "                }"));
    testUsers.add(Document.parse("{\n" +
      "                    name: \"Pat\",\n" +
      "                    phone: \"3776541832\",\n" +
      "                    vehicle: \"Chevy\",\n" +
      "                    email: \"pat@something.com\"\n" +
      "                }"));
    testUsers.add(Document.parse("{\n" +
      "                    name: \"Jamie\",\n" +
      "                    phone: \"3776984257\",\n" +
      "                    vehicle: \"Toyota\",\n" +
      "                    email: \"jamie@frogs.com\"\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("name", "Sam")
      .append("phone", "5874213791")
      .append("vehicle", "Frogs, Inc.")
      .append("email", "sam@frogs.com");


    userDocuments.insertMany(testUsers);
    userDocuments.insertOne(Document.parse(sam.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    userController = new UserController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getName(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("name")).getValue();
  }

  @Test
  public void getAllUsers() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = userController.getUsers(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 users", 4, docs.size());
    List<String> names = docs
      .stream()
      .map(UserControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Chris", "Jamie", "Pat", "Sam");
    assertEquals("Names should match", expectedNames, names);
  }

//  @Test
//  public void getUsersWhoHavePhone() {
//    Map<String, String[]> argMap = new HashMap<>();
//    argMap.put("phone", new String[]{"3776984257"});
//    String jsonResult = userController.getUsers(argMap);
//    BsonArray docs = parseJsonArray(jsonResult);
//
//    assertEquals("Should be 1 user", 1, docs.size());
//    List<String> names = docs
//      .stream()
//      .map(UserControllerSpec::getName)
//      .sorted()
//      .collect(Collectors.toList());
//    List<String> expectedNames = Arrays.asList("Jamie");
//    assertEquals("Name should match", expectedNames, names);
//  }

  @Test
  public void getSamById() {
    String jsonResult = userController.getUser(samsId.toHexString());
    Document sam = Document.parse(jsonResult);
    assertEquals("Name should match", "Sam", sam.get("name"));
    String noJsonResult = userController.getUser(new ObjectId().toString());
    assertNull("No name should match", noJsonResult);

  }

  @Test
  public void addUserTest() {
    String newId = userController.addNewUser("Brian", "BMW", "2273246589", "brian@yahoo.com");

    assertNotNull("Add new user should return true when user is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("phone", new String[]{"2273246589"});
    String jsonResult = userController.getUsers(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> name = docs
      .stream()
      .map(UserControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return name of new user", "Brian", name.get(0));
  }

//  @Test
//  public void getUserByVehicle() {
//    Map<String, String[]> argMap = new HashMap<>();
//    //Mongo in UserController is doing a regex search so can just take a Java Reg. Expression
//    //This will search the company starting with an I or an F
//    argMap.put("vehicle", new String[]{"F"});
//    String jsonResult = userController.getUsers(argMap);
//    BsonArray docs = parseJsonArray(jsonResult);
//    assertEquals("Should be 1 user", 1, docs.size());
//    List<String> name = docs
//      .stream()
//      .map(UserControllerSpec::getName)
//      .sorted()
//      .collect(Collectors.toList());
//    List<String> expectedName = Arrays.asList("Chris");
//    assertEquals("Name should match", expectedName, name);
//
//  }


}
