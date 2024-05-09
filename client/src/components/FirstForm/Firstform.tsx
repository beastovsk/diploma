import { Form, Input, Radio, Space } from "antd";
import s from "./form.module.scss";

const sendDataToBackend = async (data) => {
    try {
        const response = await fetch('http://localhost:3005/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        console.log(responseData);
    } catch (error) {
        console.error('Ошибка при отправке данных на бэкенд:', error);
    }
};

const handleFormSubmit = (values) => {
    sendDataToBackend(values);
};

export const Firstform = () => {
        return (
            <div className={s.firstfrombase}>
            <div className="left">
                <h1>C homeline всегда ВЫГОДНЕЕ</h1>
                <p>1 месяц БЕСПЛАТНО при оплате за 12ый месяц</p>
            </div>
            <div className={s.right}>
                <Form onFinish={handleFormSubmit}>
                    <Space direction="vertical"  >
                        <Form.Item name="name" className={s.Form}>
                            <Input placeholder="Ваше ФИО" />
                        </Form.Item>
                        
                        <p><span>Предложение истекает через</span> -9 дн -16 час -45 мин -31 сек</p>
                        <Form.Item name="phone">
                            <Input placeholder="0(999)99-99-99" />
                        </Form.Item>
                        <button type="submit" className={`${s.button} ${s.activeButton}`}>
                            Далее
                        </button>
                    </Space>
                </Form>
            </div>
        </div>
        );
    }
