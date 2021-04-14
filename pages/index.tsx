import Head from 'next/head'
import { Alert, Upload, Button, Form, Input, Layout, Typography, Table } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import styles from '../styles/Home.module.css'
import { useState } from 'react';

const { Header, Content, Footer } = Layout
const { Title } = Typography

export default function Home() {
	const [state, setState] = useState({
		fileList: [
			//{
			//	uid: '-1',
			//	name: 'xxx.png',
			//	status: 'done',
			//	url: 'http://www.baidu.com/xxx.png',
			//},
		],
	})
	const cols = [
		{
			title: "Név",
			dataIndex: "name",
		},
		{
			title: "SHA-256",
			dataIndex: "hash"
		}
	]

	const props = {
		//action: '',
		onChange: async (info) => {
			let fileList = [...info.target.files];
			let hashList = []
			//fileList = fileList.slice(-2);

			fileList.map((file, id) => {
				// if (file.response) {
				// 	// Component will show file.url:link
				// 	file.url = file.response.url;
				// }
				let reader = new FileReader();
				reader.onload = async r => {
					hashList[id] = window.crypto.subtle.digest(
						{ name: "SHA-256" },
						r.target.result as ArrayBuffer
					)
					if (id == fileList.length-1) {
						let allHash = await Promise.all(hashList)
						allHash.map((hash,id) => {
							fileList[id].hash = bytesToHexString(hash).toUpperCase()
						})
						setState({ fileList });			
					}
					console.log(id, fileList.length, fileList)
				}
			//	console.log(file)
				reader.readAsArrayBuffer(file)
				return file;
			});
		},
		multiple: true,
	}

	return (
		<Layout>
			<Head>
				<title>E-számla SHA ellenőrző 0.3</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header className={styles.title}>
				<div className={styles.logo} />
				<a>E-számla SHA ellenőrző</a>
			</Header>
			<Content className={styles.content}>
				<input type="file" {...props}/>
				<Table dataSource={state.fileList} columns={cols}/>
			</Content>
		</Layout>
	)
}


function bytesToHexString(bytes) {
	if (!bytes)
			return null;
	bytes = new Uint8Array(bytes);
	var hexBytes = [];
	for (var i = 0; i < bytes.length; ++i) {
			var byteString = bytes[i].toString(16);
			if (byteString.length < 2)
					byteString = "0" + byteString;
			hexBytes.push(byteString);
	}
	return hexBytes.join("");
}
//<Upload {...props} fileList={state.fileList}>
//<Button icon={<UploadOutlined />}>Upload</Button>
//</Upload>
