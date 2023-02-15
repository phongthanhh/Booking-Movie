import React, { useState } from 'react';
import { Formik, useFormik } from 'formik';
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Switch,
    TreeSelect,
} from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { addNewFilmAction } from '../../../../redux/action/movieManagerAction';
import { GROUP_ID } from '../../../../util/settings';

import dayjs from 'dayjs';


const AddNewFilm = () => {
    const [componentSize, setComponentSize] = useState('default');
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    const dispatch = useDispatch()

    const [img, setImg] = useState('')

    const formik = useFormik({
        initialValues: {
            tenPhim: '',
            trailer: '',
            moTa: '',
            ngayKhoiChieu: '',
            dangChieu: false,
            sapChieu: false,
            hot: false,
            danhGia: 0,
            hinhAnh: {},
            maNhom: GROUP_ID

        },
        onSubmit: values => {
            console.log('value', values)
            let formData = new FormData()
            for (const key in values) {
                if (key !== 'hinhAnh') {
                    formData.append(key, values[key])
                } else {
                    formData.append('File', values.hinhAnh, values.hinhAnh.name)
                }
            }
            dispatch(addNewFilmAction(formData))
        }
    })

    const handleChangeDatePicker = (value) => {
        const result = dayjs(value).format('DD/MM/YYYY')
        console.log('PhongThanh 🚀 ~> result', result)
        formik.setFieldValue('ngayKhoiChieu', result)
    }

    const handleChangeSwitch = name => {
        return value => formik.setFieldValue(name, value)
    }

    const handleChangeInputNumber = name => {
        return value => formik.setFieldValue(name, value)
    }

    const handleOnChangeFile = (e) => {
        // image / png, image / jpeg, image / gif, image / jpg
        const file = e.target.files[0]
        console.log('PhongThanh 🚀 ~> file', file)
        if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg') {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = e => {
                setImg(e.target.result)
            }
            formik.setFieldValue('hinhAnh', file)
        }
    }

    return (
        <div className='container'>
            <h2>Add New Film</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: componentSize,
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item label="Tên Phim">
                    <Input name='tenPhim' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Trailer">
                    <Input name='trailer' onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Mô tả">
                    <Input name='moTa' onChange={formik.handleChange} />
                </Form.Item>

                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker className='ml-2' format={'DD/MM/YYYY'} onChange={handleChangeDatePicker} />
                </Form.Item>

                <Form.Item label="Đang chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('dangChieu')} />
                </Form.Item>
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('sapChieu')} />
                </Form.Item>
                <Form.Item label="Hot" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('hot')} />
                </Form.Item>
                <Form.Item label="Đánh giá">
                    <InputNumber min={0} max={10} onChange={handleChangeInputNumber('danhGia')} />
                </Form.Item>
                <Form.Item label="Hình ảnh">
                    <input type='file' onChange={handleOnChangeFile} accept='image/png,image/jpeg,image/gif,image/jpg' />
                    <img className='mt-3' src={img} style={{ width: 150, height: 150 }} alt="..." />
                </Form.Item>
                <Form.Item >
                    <button type='submit' className='btn btn-info'>ADD</button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddNewFilm;
