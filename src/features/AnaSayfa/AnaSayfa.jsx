import { useState } from 'react';
import { 
  Button, Flex, TextField, Card, Text, Heading, 
  Badge, Tabs, Box, Grid, Select, Checkbox, 
  Switch, RadioGroup, Slider, Table 
} from '@radix-ui/themes';
import PanelLayout from '../PanelLayout/PanelLayout';

// Mock (Örnek) Lojistik Sipariş Verileri
const ÖRNEK_SİPARİŞLER = [
  { id: 'SP-401', musteri: 'Pamuk Gıda Antakya', urun: 'Pepsi 330ml Palet', miktar: '8 Palet', durum: 'Dağıtımda', rota: 'Antakya Merkez', arac: '31 AGA 120' },
  { id: 'SP-402', musteri: 'Hatay Dağıtım Ltd.', urun: 'Yedigün Kutu Palet', miktar: '4 Palet', durum: 'Beklemede', rota: 'İskenderun Liman', arac: '31 HP 450' },
  { id: 'SP-403', musteri: 'Samandag Tedarik', urun: 'Fruko Gazoz Palet', miktar: '6 Palet', durum: 'Teslim Edildi', rota: 'Samandag Noktası', arac: '31 SY 880' },
  { id: 'SP-404', musteri: 'Akdeniz Market zinciri', urun: 'Pepsi Max Palet', miktar: '12 Palet', durum: 'Dağıtımda', rota: 'Antakya Çevre Yolu', arac: '31 AGA 120' },
];

export default function AnaSayfa() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [aramaMetni, setAramaMetni] = useState(''); // Sol panel genel arama

  // 🔥 HER SÜTUN İÇİN AYRI PARAMETRİK STATE YAPISI
  const [sutunFiltreleri, setSutunFiltreleri] = useState({
    id: { deger: '', operator: 'icerir' },
    musteri: { deger: '', operator: 'icerir' },
    urun: { deger: '', operator: 'icerir' },
    miktar: { deger: '', operator: 'buyuktur' }, // Miktar için default büyük olsun
    rota: { deger: '', operator: 'icerir' }
  });

  const [switchAktif, setSwitchAktif] = useState(true);
  const [seciliRota, setSeciliRota] = useState('antakya');
  const [sliderDeger, setSliderDeger] = useState([50]);
  const [seciliSiparis, setSeciliSiparis] = useState(ÖRNEK_SİPARİŞLER[0]);

  // Yardımcı fonksiyon: Belirli bir sütunun filtresini güncellemek için
  const filtreGuncelle = (sutun, alan, yeniDeger) => {
    setSutunFiltreleri(prev => ({
      ...prev,
      [sutun]: {
        ...prev[sutun],
        [alan]: yeniDeger
      }
    }));
  };

  // 🔥 ÇOKLU SÜTUN KOMBİNASYONLU FİLTRELEME MOTORU
  const filtrelenmisSiparisler = ÖRNEK_SİPARİŞLER.filter(siparis => {
    // 1. Sol panel genel arama kontrolü
    const genelAramaUyum = siparis.musteri.toLowerCase().includes(aramaMetni.toLowerCase()) ||
                           siparis.id.toLowerCase().includes(aramaMetni.toLowerCase());
    if (!genelAramaUyum) return false;

    // 2. Her sütunu kendi içinde tek tek kontrol et (AND mantığı)
    for (const sutun in sutunFiltreleri) {
      const { deger, operator } = sutunFiltreleri[sutun];
      
      if (!deger) continue; // Eğer bu sütuna bir filtre yazılmadıysa sıradakine geç

      let hucreDegeri = siparis[sutun];
      let karsilastirilacakDeger = deger;

      // Sayısal miktar alanı için veri temizleme ve integer dönüşümü
      if (sutun === 'miktar') {
        hucreDegeri = parseInt(hucreDegeri.replace(' Palet', ''), 10) || 0;
        karsilastirilacakDeger = parseInt(deger, 10) || 0;
      } else {
        hucreDegeri = String(hucreDegeri).toLowerCase();
        karsilastirilacakDeger = String(deger).toLowerCase();
      }

      // Her sütunun kendi operatörüne göre kıyaslama yap
      let sutunUyumluMu = true;
      switch (operator) {
        case 'icerir': sutunUyumluMu = String(hucreDegeri).includes(String(karsilastirilacakDeger)); break;
        case 'icermez': sutunUyumluMu = !String(hucreDegeri).includes(String(karsilastirilacakDeger)); break;
        case 'esit': sutunUyumluMu = hucreDegeri === karsilastirilacakDeger; break;
        case 'esit_degil': sutunUyumluMu = hucreDegeri !== karsilastirilacakDeger; break;
        case 'buyuktur': sutunUyumluMu = hucreDegeri > karsilastirilacakDeger; break;
        case 'kucuktur': sutunUyumluMu = hucreDegeri < karsilastirilacakDeger; break;
      }

      if (!sutunUyumluMu) return false; // Eğer tek bir sütun bile kurala uymuyorsa elensin
    }

    return true;
  });

  return (
    <PanelLayout
      logoIcerik={
        <Flex align="center" gap="2">
          <Heading size="4" weight="bold" tracking="wider" style={{ color: 'var(--blue-9)' }}>
            🚀 COMPONENT WORKSHOP
          </Heading>
          <Badge color="blue" variant="surface">Storybook v1.0</Badge>
        </Flex>
      }
      
      // --- SOL PANEL: Dinamik Arama Filtresi ---
      solPanelIcerik={
        <Flex direction="column" gap="3">
          <Heading size="3" mb="1">🔍 Atölye Arama</Heading>
          <TextField.Root 
            placeholder="Müşteri veya Sipariş No..." 
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
          >
            <TextField.Slot>🔍</TextField.Slot>
          </TextField.Root>

          <Flex direction="column" gap="1" mt="2">
            <Text size="1" color="gray">Katalog Sayfaları:</Text>
            <Button variant="ghost" justify="start">🔘 Buttons (Butonlar)</Button>
            <Button variant="ghost" justify="start">📝 Form Elemanları</Button>
            <Button variant="ghost" justify="start">📐 Düzen & Tablolar</Button>
          </Flex>
          
          {aramaMetni && (
            <Text size="1" color="amber" mt="2">
              💡 Tablo şu an "{aramaMetni}" kelimesine göre filtreleniyor.
            </Text>
          )}
        </Flex>
      }
      
      // --- SAĞ PANEL: CANLI ETKİLEŞİM ODASI (Tablo Burayı Besliyor!) ---
      sagPanelIcerik={
        <Flex direction="column" gap="3">
          <Heading size="3" mb="1">📊 Dinamik Detay Paneli</Heading>
          
          {seciliSiparis ? (
            <Card variant="surface" style={{ borderLeft: '4px solid var(--accent-9)' }}>
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Badge color="cyan">{seciliSiparis.id}</Badge>
                  <Badge color={
                    seciliSiparis.durum === 'Teslim Edildi' ? 'green' : 
                    seciliSiparis.durum === 'Dağıtımda' ? 'blue' : 'amber'
                  }>
                    {seciliSiparis.durum}
                  </Badge>
                </Flex>
                
                <Box mt="1">
                  <Text size="1" color="gray" as="div">Müşteri Cari:</Text>
                  <Text size="2" weight="bold">{seciliSiparis.musteri}</Text>
                </Box>

                <Grid columns="2" gap="2" mt="1">
                  <Box>
                    <Text size="1" color="gray" as="div">Yük Hacmi:</Text>
                    <Text size="2" weight="bold">{seciliSiparis.miktar}</Text>
                  </Box>
                  <Box>
                    <Text size="1" color="gray" as="div">Atanan Araç:</Text>
                    <Text size="2" weight="bold">{seciliSiparis.arac}</Text>
                  </Box>
                </Grid>

                <Box mt="1">
                  <Text size="1" color="gray" as="div">Rota Hedefi:</Text>
                  <Text size="2" color="gray">{seciliSiparis.rota}</Text>
                </Box>
              </Flex>
            </Card>
          ) : (
            <Text size="2" color="gray">Detayları görmek için tablodan bir satıra tıklayın.</Text>
          )}

          <Card variant="surface" mt="2">
            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">Global Kontrol</Text>
              <Button 
                variant={isButtonLoading ? "solid" : "outline"} 
                color={isButtonLoading ? "amber" : "gray"}
                onClick={() => setIsButtonLoading(!isButtonLoading)}
              >
                {isButtonLoading ? "⏳ Loading Kapat" : "🔄 Loading Aç"}
              </Button>
            </Flex>
          </Card>
        </Flex>
      }
      
      footerIcerik={
        <Flex align="center" gap="2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--green-9)' }}></div>
          <Text size="1" color="gray">Bileşen Laboratuvarı Aktif ve Canlı İzleniyor</Text>
        </Flex>
      }
    >
      {/* --- ANA WORKSHOP ALANI (TABS) --- */}
      <Tabs.Root defaultValue="layouts">
        <Tabs.List size="2">
          <Tabs.Trigger value="buttons">🔘 Buttons (Butonlar)</Tabs.Trigger>
          <Tabs.Trigger value="fields">📝 Form Elemanları</Tabs.Trigger>
          <Tabs.Trigger value="layouts">📐 Düzen & Tablolar</Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          {/* ================= 1. SEKME: BUTONLAR ================= */}
          <Tabs.Content value="buttons">
            <Flex direction="column" gap="5">
              <Box>
                <Heading size="4" mb="2" color="gray">1. Varyasyonlar (Variants)</Heading>
                <Card variant="ghost" style={{ backgroundColor: 'var(--gray-3)', padding: '15px' }}>
                  <Flex gap="3" wrap="wrap">
                    <Button variant="solid">Solid (Ana)</Button>
                    <Button variant="soft">Soft (Yumuşak)</Button>
                    <Button variant="outline">Outline (Çerçeve)</Button>
                    <Button variant="surface">Surface</Button>
                    <Button variant="ghost">Ghost (Hayalet)</Button>
                  </Flex>
                </Card>
              </Box>

              <Box>
                <Heading size="4" mb="2" color="gray">2. Renk Uyumu (Colors)</Heading>
                <Card variant="ghost" style={{ backgroundColor: 'var(--gray-3)', padding: '15px' }}>
                  <Flex gap="3" wrap="wrap">
                    <Button color="blue">Blue</Button>
                    <Button color="green">Green</Button>
                    <Button color="red">Red</Button>
                    <Button color="amber">Amber</Button>
                    <Button color="crimson">Crimson</Button>
                    <Button color="gray">Gray</Button>
                  </Flex>
                </Card>
              </Box>

              <Box>
                <Heading size="4" mb="2" color="gray">3. Dinamik Durumlar (States)</Heading>
                <Card variant="ghost" style={{ backgroundColor: 'var(--gray-3)', padding: '15px' }}>
                  <Flex gap="3" align="center" wrap="wrap">
                    <Button loading={isButtonLoading}>Yükleme Modu</Button>
                    <Button disabled>Disabled (Pasif)</Button>
                    <Button size="1">Küçük (1)</Button>
                    <Button size="2">Normal (2)</Button>
                    <Button size="3">Büyük (3)</Button>
                  </Flex>
                </Card>
              </Box>
            </Flex>
          </Tabs.Content>

          {/* ================= 2. SEKME: FORM ELEMANLARI ================= */}
          <Tabs.Content value="fields">
            <Grid columns={{ initial: '1', md: '2' }} gap="4">
              <Card size="2">
                <Flex direction="column" gap="4">
                  <Heading size="3" as="h3">1. Seçim Menüleri ve Giriş</Heading>
                  <Box>
                    <Text as="div" size="2" weight="bold" mb="1">Açılır Liste (Select)</Text>
                    <Select.Root defaultValue="pepsi">
                      <Select.Trigger style={{ width: '100%' }} />
                      <Select.Content>
                        <Select.Group>
                          <Select.Label>Ürün Grupları</Select.Label>
                          <Select.Item value="pepsi">Pepsi Palet Ürünleri</Select.Item>
                          <Select.Item value="yedigun">Yedigün Meyveli</Select.Item>
                          <Select.Item value="fruko">Fruko Gazoz</Select.Item>
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text as="div" size="2" weight="bold" mb="1">Şık Metin Girişi (TextField)</Text>
                    <TextField.Root placeholder="Örn: 8 Paletlik Tır, Dorse No...">
                      <TextField.Slot>🚚</TextField.Slot>
                    </TextField.Root>
                  </Box>
                </Flex>
              </Card>

              <Card size="2">
                <Flex direction="column" gap="4">
                  <Heading size="3" as="h3">2. Onay Kutuları ve Anahtarlar</Heading>
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="bold">Çoklu Seçim (Checkbox)</Text>
                    <Text as="label" size="2"><Flex gap="2" align="center"><Checkbox defaultChecked /> Dağıtım Planı Tamamlandı</Flex></Text>
                    <Text as="label" size="2"><Flex gap="2" align="center"><Checkbox /> Faturalandırıldı</Flex></Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="2" weight="bold" mb="1">Hızlı Anahtar (Switch)</Text>
                    <Flex gap="3" align="center">
                      <Switch checked={switchAktif} onCheckedChange={setSwitchAktif} />
                      <Text size="2">{switchAktif ? "🟢 OSRM Yerel Sunucusu Bağlı" : "🔴 Çevrimdışı Mod"}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>

              <Card size="2" style={{ gridColumn: { md: 'span 2' } }}>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="bold">Bölge Seçimi (Radio Group)</Text>
                    <RadioGroup.Root value={seciliRota} onValueChange={setSeciliRota}>
                      <Flex direction="column" gap="2">
                        <Text as="label" size="2"><Flex gap="2" align="center"><RadioGroup.Item value="antakya" /> Antakya Merkez Depo</Flex></Text>
                        <Text as="label" size="2"><Flex gap="2" align="center"><RadioGroup.Item value="iskenderun" /> İskenderun Liman Şubesi</Flex></Text>
                      </Flex>
                    </RadioGroup.Root>
                  </Flex>
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="center">
                      <Text size="2" weight="bold">Yük Kapasitesi Kısıtı (Slider)</Text>
                      <Badge color="blue">{sliderDeger}%</Badge>
                    </Flex>
                    <Slider value={sliderDeger} onValueChange={setSliderDeger} max={100} step={5} />
                  </Flex>
                </Grid>
              </Card>
            </Grid>
          </Tabs.Content>

          {/* ================= 3. SEKME: DÜZENLER & VERİ TABLOSU ================= */}
          <Tabs.Content value="layouts">
            <Flex direction="column" gap="4">
              <Box>
                <Heading size="4" mb="1">Lojistik Sipariş Takip Listesi</Heading>
                <Text size="2" color="gray" as="div" mb="3">
                  Her sütunun üzerindeki bağımsız parametre panellerini kullanarak çoklu filtre kombinasyonları yapabilirsiniz.
                </Text>

                <Card variant="surface" style={{ padding: 0, overflow: 'visible' }}> {/* Select açılır kutuları taşmasın diye overflow visible yaptık */}
                  <Table.Root variant="surface" layout="auto">
                    <Table.Header>
                      {/* ÜST SATIR: ANA SÜTUN BAŞLIKLARI VE KOŞUL PANELİ */}
                      <Table.Row style={{ backgroundColor: 'var(--gray-3)' }}>
                        
                        {/* 1. SÜTUN: SIPARIŞ KODU */}
                        <Table.ColumnHeaderCell style={{ verticalAlign: 'top' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2">Sipariş Kodu</Text>
                            <Flex gap="1">
                              <Select.Root value={sutunFiltreleri.id.operator} onValueChange={(val) => filtreGuncelle('id', 'operator', val)}>
                                <Select.Trigger size="1" style={{ width: '40px' }} placeholder="⚙️" />
                                <Select.Content size="1">
                                  <Select.Item value="icerir">⊂</Select.Item>
                                  <Select.Item value="esit">=</Select.Item>
                                  <Select.Item value="esit_degil">≠</Select.Item>
                                </Select.Content>
                              </Select.Root>
                              <TextField.Root size="1" placeholder="Kod..." value={sutunFiltreleri.id.deger} onChange={(e) => filtreGuncelle('id', 'deger', e.target.value)} />
                            </Flex>
                          </Flex>
                        </Table.ColumnHeaderCell>

                        {/* 2. SÜTUN: MÜŞTERİ / CARİ */}
                        <Table.ColumnHeaderCell style={{ verticalAlign: 'top' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2">Müşteri / Cari</Text>
                            <Flex gap="1">
                              <Select.Root value={sutunFiltreleri.musteri.operator} onValueChange={(val) => filtreGuncelle('musteri', 'operator', val)}>
                                <Select.Trigger size="1" style={{ width: '80px' }} />
                                <Select.Content size="1">
                                  <Select.Item value="icerir">İçerir</Select.Item>
                                  <Select.Item value="icermez">İçermez</Select.Item>
                                  <Select.Item value="esit">Eşit</Select.Item>
                                </Select.Content>
                              </Select.Root>
                              <TextField.Root size="1" style={{ flexGrow: 1 }} placeholder="Cari ara..." value={sutunFiltreleri.musteri.deger} onChange={(e) => filtreGuncelle('musteri', 'deger', e.target.value)} />
                            </Flex>
                          </Flex>
                        </Table.ColumnHeaderCell>

                        {/* 3. SÜTUN: YÜK CİNSİ */}
                        <Table.ColumnHeaderCell style={{ verticalAlign: 'top' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2">Yük Cinsi</Text>
                            <Flex gap="1">
                              <Select.Root value={sutunFiltreleri.urun.operator} onValueChange={(val) => filtreGuncelle('urun', 'operator', val)}>
                                <Select.Trigger size="1" style={{ width: '70px' }} />
                                <Select.Content size="1">
                                  <Select.Item value="icerir">İçerir</Select.Item>
                                  <Select.Item value="esit">==</Select.Item>
                                </Select.Content>
                              </Select.Root>
                              <TextField.Root size="1" style={{ flexGrow: 1 }} placeholder="Ürün..." value={sutunFiltreleri.urun.deger} onChange={(e) => filtreGuncelle('urun', 'deger', e.target.value)} />
                            </Flex>
                          </Flex>
                        </Table.ColumnHeaderCell>

                        {/* 4. SÜTUN: MİKTAR (SAYISAL OPERATÖRLER) */}
                        <Table.ColumnHeaderCell style={{ verticalAlign: 'top' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2">Miktar</Text>
                            <Flex gap="1">
                              <Select.Root value={sutunFiltreleri.miktar.operator} onValueChange={(val) => filtreGuncelle('miktar', 'operator', val)}>
                                <Select.Trigger size="1" style={{ width: '55px' }} />
                                <Select.Content size="1">
                                  <Select.Item value="buyuktur">&gt;</Select.Item>
                                  <Select.Item value="kucuktur">&lt;</Select.Item>
                                  <Select.Item value="esit">=</Select.Item>
                                  <Select.Item value="esit_degil">≠</Select.Item>
                                </Select.Content>
                              </Select.Root>
                              <TextField.Root size="1" type="number" style={{ width: '70px' }} placeholder="Sayı..." value={sutunFiltreleri.miktar.deger} onChange={(e) => filtreGuncelle('miktar', 'deger', e.target.value)} />
                            </Flex>
                          </Flex>
                        </Table.ColumnHeaderCell>

                        {/* 5. SÜTUN: BÖLGE / ROTA */}
                        <Table.ColumnHeaderCell style={{ verticalAlign: 'top' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2">Bölge Rota</Text>
                            <Flex gap="1">
                              <Select.Root value={sutunFiltreleri.rota.operator} onValueChange={(val) => filtreGuncelle('rota', 'operator', val)}>
                                <Select.Trigger size="1" style={{ width: '70px' }} />
                                <Select.Content size="1">
                                  <Select.Item value="icerir">İçerir</Select.Item>
                                  <Select.Item value="esit">==</Select.Item>
                                </Select.Content>
                              </Select.Root>
                              <TextField.Root size="1" style={{ flexGrow: 1 }} placeholder="Rota..." value={sutunFiltreleri.rota.deger} onChange={(e) => filtreGuncelle('rota', 'deger', e.target.value)} />
                            </Flex>
                          </Flex>
                        </Table.ColumnHeaderCell>

                      </Table.Row>
                    </Table.Header>

                    {/* TABLO GÖVDESİ (Aynen kalıyor, veriler filtrelenmiş siparişlerden akacak) */}
                    <Table.Body>
                      {filtrelenmisSiparisler.map((siparis) => {
                        const isSelected = seciliSiparis?.id === siparis.id;
                        return (
                          <Table.Row 
                            key={siparis.id}
                            onClick={() => setSeciliSiparis(siparis)}
                            style={{ 
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'var(--accent-a3)' : 'transparent',
                              fontWeight: isSelected ? 'bold' : 'normal'
                            }}
                          >
                            <Table.RowHeaderCell>
                              <Flex align="center" gap="2">
                                {isSelected && <Text color="blue">▶</Text>}
                                <Badge color="cyan">{siparis.id}</Badge>
                              </Flex>
                            </Table.RowHeaderCell>
                            <Table.Cell>{siparis.musteri}</Table.Cell>
                            <Table.Cell>{siparis.urun}</Table.Cell>
                            <Table.Cell>{siparis.miktar}</Table.Cell>
                            <Table.Cell>{siparis.rota}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                      
                      {filtrelenmisSiparisler.length === 0 && (
                        <Table.Row>
                          <Table.Cell colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                            <Text size="2" color="red" weight="bold">
                              ⚠️ Sütun filtre kombinasyonlarına uygun lojistik kaydı bulunamadı!
                            </Text>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Root>
                </Card>
              </Box>

              {/* Alt tarafta bir tane de genel tüm filtreleri sıfırlama düğmesi koyalım konfor için */}
              <Flex justify="end">
                <Button size="1" variant="soft" color="red" onClick={() => setSutunFiltreleri({
                  id: { deger: '', operator: 'icerir' },
                  musteri: { deger: '', operator: 'icerir' },
                  urun: { deger: '', operator: 'icerir' },
                  miktar: { deger: '', operator: 'buyuktur' },
                  rota: { deger: '', operator: 'icerir' }
                })}>
                  ❌ Tüm Sütun Filtrelerini Sıfırla
                </Button>
              </Flex>

              {/* Seçilen sipariş özet kartı */}
              {seciliSiparis && (
                <Card size="1" variant="ghost" style={{ backgroundColor: 'var(--gray-3)' }}>
                  <Flex justify="between" align="center">
                    <Text size="2">Seçili Satır İndeksi: <strong>{seciliSiparis.id}</strong></Text>
                    <Text size="2">Rota Aracı: <Badge color="green">{seciliSiparis.arac}</Badge></Text>
                  </Flex>
                </Card>
              )}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </PanelLayout>
  );
}