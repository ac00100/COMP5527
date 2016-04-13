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
	            .entity(mapAsJson)
				.build();
	}	
	
}