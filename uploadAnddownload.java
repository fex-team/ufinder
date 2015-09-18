package upload;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.fasterxml.jackson.databind.ObjectMapper;

public class uploadAnddownload {
   public String uploadfile(HttpServletRequest request, HttpServletResponse response,String target, String ROOT) throws IOException{
	   if (!ServletFileUpload.isMultipartContent(request)) {
           throw new IllegalArgumentException("Request is not multipart, please 'multipart/form-data' enctype for your form.");
       } 
       ServletFileUpload uploadHandler = new ServletFileUpload(new DiskFileItemFactory());
       PrintWriter writer = response.getWriter();
       response.setContentType("text/html");
       ArrayList filelist = new ArrayList();
       try {
           List<FileItem> items = uploadHandler.parseRequest(request);
           for (FileItem item : items) {
               if (!item.isFormField()) {
                       File file = new File(request.getServletContext().getRealPath("/")+ROOT+target, item.getName());
                       item.write(file); 
                       return file.getName();
               }
           }
       } catch (FileUploadException e) {
               throw new RuntimeException(e);
       } catch (Exception e) {
               throw new RuntimeException(e);
       } finally {
           ObjectMapper mapper = new ObjectMapper(); 
			String data=mapper.writeValueAsString(filelist);
           writer.write(data);
           writer.close();
       }
      return "";

   }
   public void download(HttpServletRequest req, HttpServletResponse resp,String target, String ROOT) throws IOException{ 
	   
		String fileAddr = req.getServletContext().getRealPath("/")+ROOT+target;
		
		File file = new File(fileAddr);
		
		if(!file.exists()) {
			return;
		}
		// set response info
		resp.setContentType("application/x-msdownload");
		resp.setHeader("Content-Disposition", "attachment;filename=" + file.getName());
		
		OutputStream out = null;
		BufferedInputStream bis = null;
		
		try {
			// init servlet output stream
			out = resp.getOutputStream();
			
			// init download file input stream
			bis = new BufferedInputStream(new FileInputStream(file));
			
			// init buffer byte array
			byte[] buffer = new byte[1024 * 5];
			int len;
			
			// write data
			while((len = bis.read(buffer)) != -1) {
				out.write(buffer, 0, len);
			}
			
			out.flush();
			
		} finally {
			if(bis != null) {
				bis.close();
			}
			if(out != null) {
				out.close();
			}
		}
   }

   private String getMimeType(File file) {
       String mimetype = "";
       if (file.exists()) {
           if (getSuffix(file.getName()).equalsIgnoreCase("png")) {
               mimetype = "image/png";
           }else if(getSuffix(file.getName()).equalsIgnoreCase("jpg")){
               mimetype = "image/jpg";
           }else if(getSuffix(file.getName()).equalsIgnoreCase("jpeg")){
               mimetype = "image/jpeg";
           }else if(getSuffix(file.getName()).equalsIgnoreCase("gif")){
               mimetype = "image/gif";
           }else {
               javax.activation.MimetypesFileTypeMap mtMap = new javax.activation.MimetypesFileTypeMap();
               mimetype  = mtMap.getContentType(file);
           }
       }
       return mimetype;
   }



   private String getSuffix(String filename) {
       String suffix = "";
       int pos = filename.lastIndexOf('.');
       if (pos > 0 && pos < filename.length() - 1) {
           suffix = filename.substring(pos + 1);
       }
       return suffix;
   }
}
