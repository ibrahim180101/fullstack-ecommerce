import React from "react";
import { Link } from "react-router-dom";

function Home() {
    const features = [
        ["🔐", "Secure Authentication", "JWT-based login with protected API access."],
        ["🛒", "Shopping Cart", "Add products, update quantities and manage your cart."],
        ["💳", "Stripe Checkout", "Secure test-mode payments with completed orders saved to RDS."],
        ["📦", "Order Management", "Orders store the user, products, quantities, prices and payment status."],
        ["🔎", "Product Filtering", "Search, filter by category and price, and sort products."],
        ["☁️", "AWS Deployment", "Frontend and backend containers run on Amazon ECS Fargate."],
    ];

    const stack = [
        ["☕", "Java 17", "Backend"], ["🍃", "Spring Boot", "REST API"],
        ["⚛️", "React", "Frontend"], ["🎨", "Tailwind CSS", "UI"],
        ["🔑", "JWT + Spring Security", "Auth"], ["💳", "Stripe", "Payments"],
        ["🐳", "Docker", "Containers"], ["🔨", "Jenkins", "CI/CD"],
        ["📦", "Amazon ECR", "Images"], ["🚀", "Amazon ECS Fargate", "Hosting"],
        ["🗄️", "Amazon RDS MySQL", "Database"], ["🏗️", "Terraform", "IaC"],
    ];

    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <section className="relative isolate">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,.30),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(124,58,237,.24),transparent_30%)]" />
                <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
                            <span className="h-2 w-2 rounded-full bg-green-400" /> Full-Stack • Cloud • CI/CD
                        </div>
                        <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
                            A modern
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">e-commerce platform.</span>
                        </h1>
                        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                            Shop electronics, manage your cart, pay with Stripe and complete the full shopping journey through a React and Spring Boot application deployed on AWS.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link to="/products" className="rounded-xl bg-blue-600 px-6 py-3.5 font-bold shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">Explore Products →</Link>
                            <Link to="/login" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold transition hover:bg-white/10">Sign In</Link>
                        </div>
                    </div>

                    <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur md:p-7">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">Deployment flow</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold">
                            {["React Frontend", "GitHub", "Jenkins", "Docker", "Amazon ECR", "ECS Fargate", "RDS MySQL"].map((item, index, items) => (
                                <React.Fragment key={item}>
                                    <span className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-200">{item}</span>
                                    {index < items.length - 1 && <span className="text-blue-400">→</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white px-5 py-20 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Built for real usage</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Everything you need to shop.</h2>
                    <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">From authentication to payment confirmation, the application connects the complete shopping journey from frontend to database.</p>
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map(([icon, title, text]) => (
                            <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl dark:bg-blue-500/10">{icon}</div>
                                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-white/10 bg-slate-900 px-5 py-20 sm:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Technology</p>
                        <h2 className="mt-3 text-3xl font-black md:text-5xl">Tools used in this project.</h2>
                        <p className="mt-4 text-slate-400">Application development, containers, AWS infrastructure and automated delivery in one project.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {stack.map(([icon, name, description]) => (
                            <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:bg-white/[0.07]">
                                <div className="text-2xl">{icon}</div>
                                <h3 className="mt-3 font-bold">{name}</h3>
                                <p className="mt-1 text-sm text-slate-400">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-950 px-5 py-20 sm:px-8">
                <div className="mx-auto max-w-7xl rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-950/60 to-purple-950/40 p-8 md:p-12">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Cloud delivery</p>
                            <h2 className="mt-3 text-3xl font-black md:text-5xl">From code push to running containers.</h2>
                            <p className="mt-5 leading-8 text-slate-300">GitHub triggers Jenkins, Jenkins builds the frontend and backend Docker images, the images are pushed to Amazon ECR, and ECS runs the application. Terraform is used for AWS infrastructure and RDS MySQL stores application data.</p>
                        </div>
                        <div className="space-y-3">
                            {[["01", "Push", "Code is pushed to GitHub."], ["02", "Build", "Jenkins builds frontend and backend images."], ["03", "Publish", "Docker images are pushed to Amazon ECR."], ["04", "Deploy", "ECS task definitions use the new images."], ["05", "Run", "The application runs on AWS with RDS-backed data."]].map(([number, title, text]) => (
                                <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-sm font-black text-blue-300">{number}</span>
                                    <div><h3 className="font-bold">{title}</h3><p className="mt-0.5 text-sm text-slate-400">{text}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-20 sm:px-8">
                <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
                    <div className="text-4xl">🛍️</div>
                    <h2 className="mt-4 text-3xl font-black md:text-4xl">Ready to explore?</h2>
                    <p className="mt-3 text-slate-400">Browse the electronics collection and try the complete shopping flow.</p>
                    <Link to="/products" className="mt-7 inline-block rounded-xl bg-blue-600 px-7 py-3.5 font-bold transition hover:bg-blue-500">Shop Now →</Link>
                </div>
            </section>
        </main>
    );
}

export default Home;
