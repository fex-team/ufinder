package upload;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.fasterxml.jackson.databind.ObjectMapper;
/**
 * @author 徐兴繁
 * yntravelsky
 * 2014-11-17
 * 运行环境windwos
 *上传
 */
public class upload {
   public String uploadfile(HttpServletRequest request, HttpServletResponse response,String target, String ROOT) throws IOException{
	   if (!ServletFileUpload.isMultipartContent(request)) {
           throw new IllegalArgumentException("Request is not multipart, please 'multipart/form-data' enctype for your form.");
       } 
       ServletFileUpload uploadHandler = new ServletFileUpload(new DiskFileItemFactory());
       PrintWriter writer = response.getWriter();
       response.setContentType("text/html");
       ArrayList<?> filelist = new ArrayList();
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
  
}
