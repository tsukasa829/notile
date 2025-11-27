export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-200 bg-clip-text text-transparent">
          次の冒険へ、NextQuest
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          AIとコミュニティの力で、あなたの目標達成を全力サポート。
          学習も成長も、ゲームのように楽しく攻略しよう。
        </p>
        <a href="/dashboard" className="inline-block px-8 py-4 text-lg font-semibold bg-blue-gradient rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50">
          無料で始める
        </a>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          title="🎯 AI生成プログラム"
          description="あなたの目標に合わせて、LLMが最適な学習プログラムを自動生成"
        />
        <FeatureCard
          title="👥 コミュニティ"
          description="同じ目標を持つ仲間と励まし合い、モチベーションを維持"
        />
        <FeatureCard
          title="🏆 ゲーミフィケーション"
          description="バッジ、XP、レベルアップで成長を可視化。達成感が止まらない"
        />
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800/50 rounded-2xl p-12 text-center backdrop-blur-sm border border-primary-700/50">
        <h3 className="text-3xl font-bold mb-4">
          認定証で実績を証明
        </h3>
        <p className="text-blue-100 mb-6 max-w-xl mx-auto">
          プログラム完了者には公式の認定証を発行。LinkedInや就活サイトで、あなたのスキルを証明しよう。
        </p>
        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20">
          詳しく見る
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-primary-800/30 backdrop-blur-sm p-6 rounded-xl border border-primary-700/50 hover:border-primary-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  );
}
