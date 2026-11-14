# TaskFlow – Proje Tanıtım Dokümanı

## Projenin Amacı

TaskFlow, bir yazılım şirketinin ekip içindeki görevleri, görevlerin çalışanlara atanmasını ve durumlarının takibini yapabilmesi için geliştirilmiş bir REST API'dir. Proje, Node.js Backend Programlama eğitimi kapsamında; Node.js, Express.js, routing, middleware, CRUD ve JSON veri yönetimi becerilerini uygulamalı olarak göstermek amacıyla hazırlanmıştır.

## Senaryo

Bir yazılım şirketi, ekip üyelerinin sorumluluklarını tek bir yerden takip etmek istemektedir. Yöneticiler yeni görev oluşturur, görevi bir çalışana atar, öncelik belirler ve görev durumunu (bekliyor, devam ediyor, tamamlandı) günceller. Gerektiğinde görev silinir. Sistem, bu işlemleri HTTP üzerinden JSON formatında yapan bir API olarak çalışır.

## Sistem Özeti

- **Teknolojiler:** Node.js, Express.js, JSON dosyası ile veri saklama
- **Mimari:** `routes` (yönlendirme), `controllers` (iş mantığı), `middleware` (logger) ve `data` (JSON veri) katmanlarına ayrılmış yapı
- **Görev alanları:** id, title, description, status, priority, assignee, createdAt, updatedAt

## Temel Özellikler

| İşlem | Endpoint |
|---|---|
| Görev ekleme | `POST /tasks` |
| Görev listeleme | `GET /tasks` |
| Görev detayı | `GET /tasks/:id` |
| Görev güncelleme | `PUT /tasks/:id` |
| Görev silme | `DELETE /tasks/:id` |

- **Logger middleware:** Tüm API istekleri (method, endpoint, zaman damgası) konsola ve `requests.log` dosyasına kaydedilir.
- **Temel doğrulama:** Eksik `title` veya geçersiz `status`/`priority` değerlerinde `400`, bulunamayan kayıtta `404` döner.

## Veri Modeli

| Alan | Tür | Not |
|---|---|---|
| id | number | Otomatik artan |
| title | string | Zorunlu |
| description | string | İsteğe bağlı |
| status | string | pending, in-progress, completed |
| priority | string | low, medium, high |
| assignee | string | Atanan çalışan |
| createdAt, updatedAt | tarih | Otomatik |

## Sonuç

Proje, görev yönetimi için temel CRUD işlemlerini, katmanlı bir kod yapısını ve bir logger middleware'ini içeren çalışan bir REST API sunar. Kurulum ve çalıştırma adımları `README.md` dosyasındadır; testler Postman üzerinden yapılmıştır.
