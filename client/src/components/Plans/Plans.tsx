import { Form, Input, Radio, Space } from "antd";
import s from "./Plans.module.scss";
import { useState } from "react";

export const Plans = () => {
    const [step, setStep] = useState(0);
    const firstPlan = [
        {
            title: "Тариф XL 1",
            oldPrice: "860 сом/месяц",
            price: "*688 сом",
            speed: "До 70 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "До 5-6 устройств. Если вам достаточно мессенджеров и соцсетей.",
            ],
        },
        {
            title: "Тариф XXL 2",
            oldPrice: "1070 сом/месяц",
            price: "*856 сом",
            speed: "До 400 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "*Акция продлится до 31.08.2024",
            ],
        },
        {
            title: "Тариф XXXL 3",
            oldPrice: "1300 сом/месяц",
            price: "*1040 сом",
            speed: "До 400 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "*Акция продлится до 31.08.2024",
            ],
        },
    ];

    const secondPlan = [
        {
            title: "Тариф XL 1",
            oldPrice: "860 сом/месяц",
            price: "*688 сом",
            speed: "До 70 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "До 5-6 устройств. Если вам достаточно мессенджеров и соцсетей.",
            ],
        },
        {
            title: "Тариф XXL 2",
            oldPrice: "1070 сом/месяц",
            price: "*856 сом",
            speed: "До 400 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "*Акция продлится до 31.08.2024",
            ],
        },
        {
            title: "Тариф XXXL 3",
            oldPrice: "1300 сом/месяц",
            price: "*1040 сом",
            speed: "До 400 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "*Акция продлится до 31.08.2024",
            ],
        },
        {
            title: "Тариф XXL 2",
            oldPrice: "1070 сом/месяц",
            price: "*856 сом",
            speed: "До 400 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "*Акция продлится до 31.08.2024",
            ],
        },
        {
            title: "Тариф XXXL 3",
            oldPrice: "1300 сом/месяц",
            price: "*1040 сом",
            speed: "До 400 Мбит/с",
            descs: [
                "*При оплате за 1ый и 12ый месяц",
                "*Подключается услуга годовой контракт со скидкой 20%",
                "*Акция продлится до 31.08.2024",
            ],
        },
    ];

    const [plan, setPlan] = useState(0);

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

    return (
        <div className={s.container}>
            <h1 className={s.mb}>Тарифные планы</h1>

            <div className={s.row}>
                <button
                    onClick={() => setPlan(0)}
                    className={`${s.button} ${plan === 0 ? s.activeButton : ""}`}
                >
                    Интернет
                </button>
                <button
                    onClick={() => setPlan(1)}
                    className={`${s.button} ${plan === 1 ? s.activeButton : ""}`}
                >
                    Интернет + TV
                </button>
            </div>

            <div className={s.content}>
                {plan === 0
                    ? firstPlan.map(({ descs, oldPrice, price, speed, title }) => (
                        <div className={s.item} key={title}>
                            <div className={s.header}>
                                <h2>{title}</h2>
                            </div>
                            <div className={s.wrapper}>
                                <div className={s.price}>
                                    <i>{oldPrice}</i>
                                    <p>{price}</p>
                                </div>
                                <h3>{speed}</h3>
                                {descs.map((item, index) => (
                                    <p className={s.desc} key={index}>
                                        {item}
                                    </p>
                                ))}
                            </div>
                            <button className={`${s.planButton} ${s.button} ${s.activeButton}`}>
                                Подключить
                            </button>
                        </div>
                    ))
                    : plan === 1
                        ? secondPlan.map(({ descs, oldPrice, price, speed, title }) => (
                            <div className={s.item} key={title}>
                                <div className={s.header}>
                                    <h2>{title}</h2>
                                </div>
                                <div className={s.wrapper}>
                                    <div className={s.price}>
                                        <i>{oldPrice}</i>
                                        <p>{price}</p>
                                    </div>
                                    <h3>{speed}</h3>
                                    {descs.map((item, index) => (
                                        <p className={s.desc} key={index}>
                                            {item}
                                        </p>
                                    ))}
                                </div>
                                <button className={`${s.planButton} ${s.button} ${s.activeButton}`}>
                                    Подключить
                                </button>
                            </div>
                        ))
                        : null}
            </div>

            <h3>
                * Подключение на тарифный план Единый-M возможно только в многоквартирных домах
            </h3>

            <div className={s.qa}>
                <h1>Как выбрать тариф на интернет?</h1>
                <p>
                    Не знаешь какой тариф выбрать? Ответьте на пару вопросов - мы подскажем
                </p>
                {step === 0 ? (
                    <div>
                        <h2 className={s.subtitle}>Для чего нужен интернет</h2>
                        <div className={s.text}>
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value="Просматривать веб-страницы, соц сети и электронную почту">
                                        Просматривать веб-страницы, соц сети и электронную почту
                                    </Radio>
                                    <Radio value="Смотреть видео и фильмы онлайн">
                                        Смотреть видео и фильмы онлайн
                                    </Radio>
                                    <Radio value="Играть по сети">Играть по сети</Radio>
                                    <Radio value="Для работы или учебы из дома">Для работы или учебы из дома</Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            className={`${s.button} ${s.activeButton}`}
                        >
                            Далее
                        </button>
                    </div>
                ) : null}
                {step === 1 ? (
                    <div>
                        <h2 className={s.subtitle}>Сколько устройств дома?</h2>
                        <div className={s.text}>
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value="1-3">1-3</Radio>
                                    <Radio value="4-6">4-6 </Radio>
                                    <Radio value="7-9">7-9 </Radio>
                                    <Radio value="10+">10+</Radio>
                                </Space>
                            </Radio.Group>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className={`${s.button} ${s.activeButton}`}
                        >
                            Далее
                        </button>
                    </div>
                ) : null}
                {step === 2 ? (
                    <div>
                        <h2 className={s.subtitle}>Оставьте свой контакт, мы проконсультируем Вас</h2>
                        <Form onFinish={handleFormSubmit}>
                            <Form.Item name="name">
                                <Input placeholder="Ваше ФИО" />
                            </Form.Item>
                            <Form.Item name="phone">
                                <Input placeholder="0(999)99-99-99" />
                            </Form.Item>
                            <button type="submit" className={`${s.button} ${s.activeButton}`}>
                                Далее
                            </button>
                        </Form>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
