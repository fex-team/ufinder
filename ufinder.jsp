<%--徐兴繁贡献 jsp版本--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="ufinder.ufinder"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.List"%>
<%@ page import="upload.uploadAnddownload"%>
<%@ page import="java.io.BufferedInputStream"%>
<%@ page import="java.io.File"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="java.io.IOException"%>
<%@ page import="java.io.OutputStream"%>
<%
	String ROOT = "/files";

	String cmd = request.getParameter("cmd"); //$_GET["cmd"];
	String target = request.getParameter("target"); //$target = $_GET["target"]; 
	ufinder uf = new ufinder();

	String array[] = { ".gif", ".png", ".jpg", ".jpeg", ".bmp" };
	Map<String, Object> uploadconfig = new HashMap();
	uploadconfig.put("savePath", "upload/");
	uploadconfig.put("maxSize", 1000);
	uploadconfig.put("allowFiles", array);
	Map<String, Object> sysconfig = new HashMap();
	;
	sysconfig.put("ROOT", "/files");
	sysconfig.put("write", true);
	sysconfig.put("read", true);
	sysconfig.put("upload", uploadconfig);
	Map<String, Object> mapconfig = new HashMap();
	if (cmd.equals("init")) {
		Map<String, Object> map = new HashMap();
		;
		map.put("root", uf.getFileInfo("/", ROOT));
		map.put("config", mapconfig);
		out.println(uf.getJson("0", "success", map));
	} else if (cmd.equals("ls")) {
		if (null != target && !target.equals(""))
			;
		else
			target = "";
		List list = uf.listFile(target, ROOT);
		Map<String, Object> mapfils = new HashMap();
		mapfils.put("files", list);
		out.println(uf.getJson("0", "success", mapfils));
	} else if (cmd.equals("rename")) {
		String name = request.getParameter("name");
		Boolean flag = uf.rename(ROOT + target, ROOT + name);
		Map<String, Object> renamemap = new HashMap();
		renamemap.put("file", uf.getFileInfo(name, ROOT));
		if (flag) {
			out.println(uf.getJson("0", "success", renamemap));
		} else {
			out.println(uf.getJson("1", "rename error", null));
		}

	} else if (cmd.equals("rm")) {
		Boolean flag = false;
		String[] targets = request.getParameterValues("target[]");
		for (int i = 0; i < targets.length; i++) {
			flag = uf.remove(targets[i], ROOT);
			if (!flag) {
				break;
			}
		}

		if (flag) {
			out.println(uf.getJson("0", "success", null));
		} else {
			out.println(uf.getJson("1", "rename error", null));
		}

	} else if (cmd.equals("touch")) {
		Boolean flag = uf.file_put_contents(target, ROOT);
		if (flag) {
			Map<String, Object> map = new HashMap();
			map.put("file", uf.getFileInfo(target, ROOT));
			out.println(uf.getJson("0", "success", map));
		} else {
			out.println(uf.getJson("1", "touch error", null));
		}

	} else if (cmd.equals("mkdir")) {
		Boolean res = uf.mkdir(ROOT, target);
		Map<String, Object> dirmap = new HashMap();
		dirmap.put("file", uf.getFileInfo(target, ROOT));
		if (res) {
			out.println(uf.getJson("0", "success", dirmap));
		} else {
			out.println(uf.getJson("1", "error", dirmap));
		}

	} else if (cmd.equals("upload")) {
		uploadAnddownload up = new uploadAnddownload();
		String filename = up
				.uploadfile(request, response, target, ROOT);
		Map<String, Object> umap = new HashMap();
		umap.put("file", uf.getFileInfo(target + filename, ROOT));
		if (filename.length() > 0) {
			System.out.print(uf.getJson("0", "success", umap));
			out.println(uf.getJson("0", "success", umap));
		} else {
			out.println(uf.getJson("1", "fail", umap));
		}
	} else if (cmd.equals("download")) {
		response.setContentType("text/html");
		OutputStream o = response.getOutputStream();
		byte b[] = new byte[5000];
		String fileAddr = request.getRealPath("/") + ROOT + target;
		File fileLoad = new File(fileAddr);
		response.setContentType("application/x-msdownload");

		response.setHeader("content-disposition",
				"attachment; filename=" + fileLoad.getName());
		long fileLength = fileLoad.length();
		String length1 = String.valueOf(fileLength);
		response.setHeader("Content_Length", length1);
		FileInputStream in = new FileInputStream(fileLoad);
		int n;
		while ((n = in.read(b)) != -1) {
			o.write(b, 0, n);
		}
		in.close();
		out.clear();
		out = pageContext.pushBody();
	} else if (cmd.equals("info")) {
		Map<String, Object> map = new HashMap();
		map.put("file", uf.getFileInfo(target, ROOT));
		out.println(uf.getJson("0", "success", map));
	} else {
		out.println(uf.getJson("1", "unknow command", null));
	}
%>
