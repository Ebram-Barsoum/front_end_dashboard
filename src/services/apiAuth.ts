import axiosInstance from "../lib/axios";

export async function login(email: string, password: string) {
    const { data } = await axiosInstance.post(`/super-users/login?lang=ar`, {
        email, password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return data;
}

export async function send_verification_email(email: string) {
    const { data } = await axiosInstance.post('/super-users/forgot-password?lang=en', { email },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return data;
}

export async function reset_password(newPassword: string, resetToken?: string) {
    const { data } = await axiosInstance.patch('/super-users/reset-password?lang=en', {
        password: newPassword,
        resetToken
    },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    return data;
}