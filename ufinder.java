package ufinder;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import upload.upload;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author xxf
 * 2014-11-17
 * 运行环境windwos
 *
 */
public class ufinder extends HttpServlet { private static final long serialVersionUID = 9171771165035078855L;
	private String propath=""; 

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException { 
		doPost(req, resp);
	}

	public void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		propath=request.getServletContext().getRealPath("/");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		String ROOT = "/files";

		String cmd = request.getParameter("cmd"); // $_GET["cmd"];
		String target = request.getParameter("target"); // $target =
														// $_GET["target"]; 

		String array[] = { ".gif", ".png", ".jpg", ".jpeg", ".bmp" };
		Map<String, Object> uploadconfig = new HashMap<String, Object>();
		uploadconfig.put("savePath", "upload/");
		uploadconfig.put("maxSize", 1000);
		uploadconfig.put("allowFiles", array);
		Map<String, Object> sysconfig = new HashMap<String, Object>(); 
		sysconfig.put("ROOT", "/files");
		sysconfig.put("write", true);
		sysconfig.put("read", true);
		sysconfig.put("upload", uploadconfig);
		
		Map<String, Object> mapconfig = new HashMap<String, Object>();
		
		Map<String, Object> map = new HashMap<String, Object>(); 
 
		if (cmd.equals("init")) { //初始化
			map.put("root", getFileInfo("/", ROOT));
			map.put("config", mapconfig);
			out.println(getJson("0", "success", map));
		} else if (cmd.equals("ls")) {//文件列表
			if (null != target && !target.equals(""))
				;
			else
				target = "";
			List<Map<String, Object>> list = listFile(target, ROOT); 
			map.put("files", list);
			out.println(getJson("0", "success", map));
		} else if (cmd.equals("rename")) {//重命名
			String name = request.getParameter("name");
			Boolean flag = rename(ROOT + target, ROOT + name); 
			map.put("file", getFileInfo(name, ROOT));
			if (flag) {
				out.println(getJson("0", "success", map));
			} else {
				out.println(getJson("1", "rename error", null));
			}

		} else if (cmd.equals("rm")) {//删除
			Boolean flag = false;
			String[] targets = request.getParameterValues("target[]");
			for (int i = 0; i < targets.length; i++) {
				flag = remove(targets[i], ROOT);
				if (!flag) {
					break;
				}
			}

			if (flag) {
				out.println(getJson("0", "success", null));
			} else {
				out.println(getJson("1", "rename error", null));
			}

		} else if (cmd.equals("touch")) {//新建文件
			Boolean flag = file_put_contents(target, ROOT);
			if (flag) { 
				map.put("file", getFileInfo(target, ROOT));
				out.println(getJson("0", "success", map));
			} else {
				out.println(getJson("1", "touch error", null));
			}

		} else if (cmd.equals("mkdir")) {//新建目录
			Boolean res = mkdir(ROOT, target); 
			map.put("file", getFileInfo(target, ROOT));
			if (res) {
				out.println(getJson("0", "success", map));
			} else {
				out.println(getJson("1", "error", map));
			}

		} else if (cmd.equals("upload")) {//上传：目前可能因ufinder还有问题
			upload up = new upload();
			String filename = up.uploadfile(request, response, target, ROOT); 
			map.put("file", getFileInfo(target + filename, ROOT));
			if (filename.length() > 0) {
				System.out.print(getJson("0", "success", map));
				out.println(getJson("0", "success", map));
			} else {
				out.println(getJson("1", "fail", map));
			}
		} else if (cmd.equals("download")) {//下载
			download(request, response, target, ROOT);
		} else if (cmd.equals("info")) { 
			map.put("file", getFileInfo(target, ROOT));
			out.println(getJson("0", "success", map));
		} else {
			out.println(getJson("1", "unknow command", null));
		}
	}

	public String getJson(String state, String message, Map<String, Object> data) {
		Map<String, Object> jsonmap = new HashMap<String, Object>();
		jsonmap.put("state", state);
		jsonmap.put("message", message);

		if (data != null)
			jsonmap.put("data", data);

		ObjectMapper mapper = new ObjectMapper();
		String json = "";
		try {
			json = mapper.writeValueAsString(jsonmap);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return json;
	}

	public List<Map<String, Object>> listFile(String dirpath, String ROOT)
			throws JsonProcessingException {
		String ROOTPATH =propath + ROOT;
		File dir = new File(ROOTPATH + dirpath);
		File[] files = dir.listFiles();
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		if (null != files) {
			for (int i = 0; i < files.length; i++) {
				list.add(getFileInfo("/" + files[i].getPath().substring(propath.length()+6),
						ROOT));
			}
		}
		return list;
	}

	public String getFileName(String path) {
		int index = path.lastIndexOf("/");
		if (index != -1) {
			return path.substring(index);
		} else {
			return path;
		}
	}

	public Map<String, Object> getFileInfo(String path, String root) {
		String rootpath =propath + root + path; 
		String regexp = "\\\\";
		path = path.replaceAll(regexp, "/");
		File file = new File(rootpath);
		Map<String, Object> info = new HashMap<String, Object>();
		if (path.lastIndexOf(".") != -1 || path.equals("/")) {
			info.put("path", path);
		} else {
			info.put("path", path + "/");
		}
		info.put("name", file.getName());
		info.put("isdir", file.isDirectory());
		if (path.lastIndexOf(".") != -1)
			info.put("type", "file");
		else {
			info.put("type", "dir");
		}
		info.put("read", file.canRead());
		info.put("write", file.canWrite());
		info.put("time", file.lastModified());
		// info.put("mode",);
		info.put("size", file.length());
		return info;

	}

	public Boolean rename(String oldname, String newname) {
		String oldpath = propath + oldname;
		String newpath = propath + newname;
		File oldfile = new File(oldpath); // 指定文件名及路径
		File newfile = new File(newpath);
		if (newfile.exists()) {
			return false;
		} else {
			oldfile.renameTo(newfile); // 改名
			return true;
		}

	}

	public Boolean file_put_contents(String target, String ROOT)
			throws IOException {
		String rootpath = propath + ROOT + target;
		File file = new File(rootpath);
		if (!file.exists()) {
			file.createNewFile();
			return true;
		} else {
			return false;
		}
	}

	public Boolean mkdir(String ROOT, String path) {
		String rootpath = propath + ROOT + path;
		File file = new File(rootpath);
		if (!file.exists()) {
			file.mkdir();
			return true;
		}
		return false;
	}

	/**
	 * 删除空目录
	 * 
	 * @param dir
	 *            将要删除的目录路径
	 */
	public void doDeleteEmptyDir(String dir) {
		boolean success = (new File(dir)).delete();
		if (success) {
			System.out.println("Successfully deleted empty directory: " + dir);
		} else {
			System.out.println("Failed to delete empty directory: " + dir);
		}
	}

	/**
	 * 递归删除目录下的所有文件及子目录下所有文件
	 * 
	 * @param dir
	 *            将要删除的文件目录
	 * @return boolean Returns "true" if all deletions were successful. If a
	 *         deletion fails, the method stops attempting to delete and returns
	 *         "false".
	 */
	public boolean deleteDir(File dir) {
		if (dir.isDirectory()) {
			String[] children = dir.list();
			for (int i = 0; i < children.length; i++) {
				boolean success = deleteDir(new File(dir, children[i]));
				if (!success) {
					return false;
				}
			}
		}
		// 目录此时为空，可以删除
		return dir.delete();
	}

	public Boolean remove(String target, String ROOT) {
		String ROOTPATH = propath + ROOT;
		File dir = new File(ROOTPATH + target);
		boolean success = deleteDir(dir);
		// doDeleteEmptyDir(ROOTPATH);
		return true;
	}

	public void download(HttpServletRequest req, HttpServletResponse resp,
			String target, String ROOT) throws IOException { 
        String fullFilePath = req.getServletContext().getRealPath("/") + ROOT
				+ target;

        /*读取文件*/

        File file = new File(fullFilePath);

        /*如果文件存在*/

        if (file.exists()) {

            String filename = URLEncoder.encode(file.getName(), "UTF-8");

            resp.reset();

            resp.setContentType("application/x-msdownload");

            resp.addHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

            int fileLength = (int) file.length();

            resp.setContentLength(fileLength);

           /*如果文件长度大于0*/

            if (fileLength != 0) {

                /*创建输入流*/

                InputStream inStream = new FileInputStream(file);

                byte[] buf = new byte[4096];

                /*创建输出流*/

                ServletOutputStream servletOS = resp.getOutputStream();

                int readLength;

                while (((readLength = inStream.read(buf)) != -1)) {

                    servletOS.write(buf, 0, readLength);

                }

                inStream.close();

                servletOS.flush();

                servletOS.close();

            }

        }
	}

}
