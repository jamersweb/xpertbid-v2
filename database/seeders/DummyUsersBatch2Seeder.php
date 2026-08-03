<?php

namespace Database\Seeders;

use App\Models\IndividualVerification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DummyUsersBatch2Seeder extends Seeder
{
    /**
     * Add dummy_user_21 … dummy_user_100 (80 users).
     * Existing batch is dummy_user_1 … dummy_user_20.
     * Each user is email-verified and individually verified.
     */
    public function run(): void
    {
        $names = [
            'Hassan Raza', 'Nadia Qureshi', 'Imran Siddiqui', 'Hira Baig', 'Zainab Noor',
            'Omar Farooq', 'Mehwish Tariq', 'Kamran Javed', 'Rabia Anwar', 'Saad Mirza',
            'Iqra Shah', 'Faisal Nadeem', 'Maham Gul', 'Danish Iqbal', 'Areeba Khan',
            'Shahbaz Ali', 'Komal Zafar', 'Waqas Rehman', 'Nimra Saeed', 'Haris Mehmood',
            'Laiba Ashraf', 'Taha Bukhari', 'Saba Yousaf', 'Arslan Haider', 'Mariam Jamil',
            'Noman Sharif', 'Hafsa Imtiaz', 'Rizwan Akhtar', 'Zoya Naeem', 'Adeel Butt',
            'Saima Pervez', 'Hamza Qadir', 'Iqbal Hussain', 'Amina Latif', 'Jahangir Alam',
            'Bushra Kazmi', 'Salman Zaidi', 'Eman Fatima', 'Asif Rauf', 'Mahnoor Ijaz',
            'Umer Shahzad', 'Hina Khalid', 'Junaid Akram', 'Sundas Bibi', 'Kashif Munir',
            'Anum Shah', 'Farhan Aziz', 'Zara Imran', 'Shahid Nawaz', 'Kiran Saleem',
            'Adnan Younis', 'Saba Noor', 'Murtaza Khan', 'Ayesha Rauf', 'Nabeel Aslam',
            'Hoorain Ali', 'Shahroz Ahmed', 'Dua Fatima', 'Yasir Mehmood', 'Sanaullah Khan',
            'Amna Bukhari', 'Rameel Hassan', 'Iman Zahra', 'Osama Tariq', 'Mishal Raza',
            'Abdullah Zia', 'Hania Saeed', 'Sameer Qureshi', 'Aleesha Noor', 'Talha Anjum',
            'Wania Malik', 'Huzaifa Sheikh', 'Eshal Javed', 'Rayyan Ahmed', 'Mahira Khan',
            'Azlan Hussain', 'Zunaira Ali', 'Ibrahim Shah', 'Aima Rehman', 'Rohail Khan',
        ];

        $password = Hash::make('password');
        $start = 21;
        $end = 100;

        for ($i = $start; $i <= $end; $i++) {
            $email = "dummy_user_{$i}@xpertbid.com";
            $name = $names[$i - $start] ?? "Dummy User {$i}";

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'username' => "dummy_user_{$i}",
                    'password' => $password,
                    'email_verified_at' => now(),
                    'role' => 'user',
                    'status' => 'active',
                    'phone' => '+92321' . str_pad((string) (3000000 + $i), 7, '0', STR_PAD_LEFT),
                ]
            );

            IndividualVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'full_legal_name' => $name,
                    'dob' => now()->subYears(rand(22, 45))->subDays(rand(0, 364))->toDateString(),
                    'nationality' => 'Pakistani',
                    'residential_address' => "House " . (($i % 90) + 1) . ", Street " . (($i % 40) + 1) . ", Demo City",
                    'id_front_path' => 'assets/images/individuals/demo-front.jpg',
                    'id_back_path' => 'assets/images/individuals/demo-back.jpg',
                    'contact_number' => $user->phone,
                    'email_address' => $email,
                    'country' => 'Pakistan',
                    'document_type' => 'CNIC',
                    'status' => 'verified',
                    'decline_reason' => null,
                ]
            );

            if ($i % 20 === 0) {
                $this->command?->info("Seeded dummy users through #{$i}...");
            }
        }

        $this->command?->info('Done: dummy_user_21@xpertbid.com … dummy_user_100@xpertbid.com (80 users).');
        $this->command?->info('Password for all: password | email_verified + individual verified.');
    }
}
