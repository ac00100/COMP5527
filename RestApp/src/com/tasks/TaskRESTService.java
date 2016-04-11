package com.tasks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
import javax.annotation.security.RolesAllowed;
import javax.print.attribute.standard.Media;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.sun.jersey.api.core.ResourceConfig;
import java.sql.*;

@Path("/")
public class TaskRESTService  {

	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost/hotel";

	// Database credentials
	static final String USER = "root";
	static final String PASS = "P@ssw0rd";
	
	static String mapAsJson="{\"results\":["
			+ "{\"id\":\"1\",\"product\":\"coca-cola\",\"price\":\"3\",\"quantity\":\"400\"}"
			+ ",{\"id\":\"2\",\"product\":\"7-up\",\"price\":\"3\",\"quantity\":\"100\"}"
			+ ",{\"id\":\"3\",\"product\":\"leamon C++\",\"price\":\"4\",\"quantity\":\"200\"}"
			+ ",{\"id\":\"4\",\"product\":\"apple juice\",\"price\":\"7\",\"quantity\":\"300\"}"
			+ ",{\"id\":\"5\",\"product\":\"orange juice\",\"price\":\"8\",\"quantity\":\"500\"}"
			+ ",{\"id\":\"6\",\"product\":\"banana juice\",\"price\":\"8\",\"quantity\":\"400\"}"
			+ "]}"; 
	
	@POST
	@Path("/taskService")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response taskREST(InputStream incomingData) {
		StringBuilder taskBuilder = new StringBuilder();
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(incomingData));
			String line = null;
			while ((line = in.readLine()) != null) {
				taskBuilder.append(line);
			}
		} catch (Exception e) {
			System.out.println("Error Parsing: - ");
		}
		System.out.println("Data Received: " + taskBuilder.toString());
 
		// return HTTP response 200 in case of success
		return Response.status(200).entity(taskBuilder.toString()).build();
	}
 
	
	
	@GET
	@Path("/customer")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCustomer(@QueryParam ("id") String id, @QueryParam ("job") String job) {
		//Map<Integer,Task> map = new HashMap<Integer,Task>();
		List<Map> tasks = new ArrayList<Map>(); 

		Connection conn = null;
		Statement stmt = null;
		System.out.println("id:" + id);
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("Connecting to database...");
			conn = DriverManager.getConnection(DB_URL, USER, PASS);
			System.out.println("Creating statement...");
			stmt = conn.createStatement();
			String sql;
			ResultSet rs=null;
			
			if (job.equalsIgnoreCase("CUST")) {
				sql = "SELECT * FROM customer a where a.CustomerID="+id;
				rs = stmt.executeQuery(sql);
				while (rs.next()) {
					Map ta = new HashMap();
					ta.put("CustomerID", rs.getInt("CustomerID"));
					ta.put("FirstName", rs.getString("FirstName"));
					ta.put("LastName", rs.getString("LastName"));
					ta.put("DOB", rs.getDate("DOB"));
					ta.put("GENDER", rs.getString("GENDER"));
					ta.put("MobileNo", rs.getString("MobileNo"));
					ta.put("Email", rs.getString("Email"));
					ta.put("isMembership", rs.getString("isMembership"));
					tasks.add(ta);
				 }
			}else if (job.equalsIgnoreCase("BOOK")) {
				sql = "select b.bookingID , b.CheckInDate , b.CheckOutDate , b.SpecialNotes , h.HotelName , h.Address , h.City , h.Country , h.PhoneNo , H.Rating , r.Floor , r.RoomID , rt.RoomClass , rt.RoomView , rt.AllowSmoking , rt.Price , rp.PackageName , rp.PackagePrice , rp.PackageDesc from Booking b join Customer c on c.CustomerID = b.CustomerID join Hotel h on h.HotelID = b.HotelID join Room r on r.RoomID = b.RoomID join RoomType rt on rt.TypeID = r.TypeID left join RoomPackage rp on rp.PackageID = b.PackageID where c.CustomerID =" +id;
				rs = stmt.executeQuery(sql);
				while (rs.next()) {
					Map ta = new HashMap();
					ta.put("bookingID", rs.getInt("bookingID"));
					ta.put("CheckInDate", rs.getDate("CheckInDate"));
					ta.put("CheckOutDate", rs.getDate("CheckOutDate"));
					ta.put("SpecialNotes", rs.getString("SpecialNotes"));
					ta.put("HotelName", rs.getString("HotelName"));
					ta.put("Address", rs.getString("Address"));
					ta.put("City", rs.getString("City"));
					ta.put("Country", rs.getString("Country"));
					ta.put("PhoneNo", rs.getString("PhoneNo"));
					ta.put("Rating", rs.getInt("Rating"));
					ta.put("Floor", rs.getInt("Floor"));
					ta.put("RoomID", rs.getInt("RoomID"));
					ta.put("RoomClass", rs.getString("RoomClass"));
					ta.put("RoomView", rs.getString("RoomView"));
					ta.put("AllowSmoking", rs.getString("AllowSmoking"));
					ta.put("Price", rs.getDouble("Price"));
					ta.put("PackageName", rs.getString("PackageName"));
					ta.put("PackagePrice", rs.getDouble("PackagePrice"));
					ta.put("PackageDesc", rs.getString("PackageDesc"));
					tasks.add(ta);
				 }
			}else if (job.equalsIgnoreCase("PRICE")) {
				sql = "Select P.Paymentid , count(b.BookingID) as TotalNoOfBooking , sum(rt.Price) as TotalPrice , sum(case when rp.PackagePrice IS NULL then rt.Price else rp.PackagePrice END) as TotalPriceWithPackage , p.TotalAmount , p.Paymentmethod from Booking b join Room r on r.RoomID = b.RoomID join RoomType rt on rt.TypeID = r.TypeID left join RoomPackage rp on rp.PackageID = b.PackageID join PaymentForBooking pb on pb.BookingID = b.BookingID join Payment p on p.PaymentID = pb.PaymentID where b.CustomerID = "+id+" group by P.Paymentid, P.Paymentmethod, p.TotalAmount";
				rs = stmt.executeQuery(sql);
				while (rs.next()) {
					Map ta = new HashMap();
					ta.put("Paymentid", rs.getInt("Paymentid"));
					ta.put("TotalNoOfBooking", rs.getInt("TotalNoOfBooking"));
					ta.put("TotalPrice", rs.getDouble("TotalPrice"));
					ta.put("TotalPriceWithPackage", rs.getDouble("TotalPriceWithPackage"));
					ta.put("TotalAmount", rs.getDouble("TotalAmount"));
					ta.put("Paymentmethod", rs.getString("Paymentmethod"));
					tasks.add(ta);
				 }
			}
			
			
			
			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			// Handle errors for Class.forName
			e.printStackTrace();
		} finally {
			// finally block used to close resources
			try {
				if (stmt != null)
					stmt.close();
			} catch (SQLException se2) {
			}// nothing we can do
			try {
				if (conn != null)
					conn.close();
			} catch (SQLException se) {
				se.printStackTrace();
			}// end finally try
		}
		
	
		String mapAsJson="";
		try {
			mapAsJson = new ObjectMapper().writeValueAsString(tasks);
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		// return HTTP response 200 in case of success
		
		
		return Response.status(200)
	            .entity(mapAsJson)
				.build();
	}	

	
	@GET
	@Path("/lists")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getLists(@QueryParam ("id") String id) {
		//Map<Integer,Task> map = new HashMap<Integer,Task>();
		List<Map> tasks = new ArrayList<Map>();
		System.out.println("id:" + id);
			
		
			
		
	
//		String mapAsJson="";
//		try {
//			mapAsJson = new ObjectMapper().writeValueAsString(tasks);
//		} catch (JsonGenerationException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (JsonMappingException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		
		// return HTTP response 200 in case of success
		
		
		return Response.status(200)
	            .entity(mapAsJson)
				.build();
	}	
	
	@GET
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response update(@QueryParam ("id") String id, @QueryParam ("taskname") String taskname) {
		System.out.println("update..." + taskname);
		
		mapAsJson = taskname;
		
		// return HTTP response 200 in case of success
		return Response.status(200)
				.header("Access-Control-Allow-Origin", "*")
	            .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
	            .header("Access-Control-Allow-Credentials", "true")
	            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
	            .header("Access-Control-Max-Age", "1209600")
	            .entity("Success")
				.build();
	}	
	
}