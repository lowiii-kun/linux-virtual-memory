import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { modelParts } from "./modelData";

function Part({
  position,
  selected,
  onSelect,
  children,
  id,
}: {
  position: [number, number, number];
  selected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  id: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      scale={hovered || selected ? 1.08 : 1}
    >
      {children}
    </group>
  );
}

function MMUPart({ selected, onSelect }: { selected: boolean; onSelect: (id: string) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });
  return (
    <Part position={[0, 1.6, 0]} selected={selected} onSelect={onSelect} id="mmu">
      <mesh ref={ref}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={modelParts.mmu.color}
          emissive={modelParts.mmu.color}
          emissiveIntensity={selected ? 0.9 : 0.4}
          wireframe={false}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      <Html distanceFactor={9} position={[0, -0.75, 0]} center>
        <div className="pointer-events-none whitespace-nowrap rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
          MMU
        </div>
      </Html>
    </Part>
  );
}

function PageTablePart({ selected, onSelect }: { selected: boolean; onSelect: (id: string) => void }) {
  const levels = ["PGD", "PUD", "PMD", "PTE"];
  return (
    <Part position={[-2.4, 0.3, 0]} selected={selected} onSelect={onSelect} id="pagetable">
      <group>
        {levels.map((l, i) => (
          <mesh key={l} position={[0, i * 0.42, 0]}>
            <boxGeometry args={[1.3, 0.28, 1]} />
            <meshStandardMaterial
              color={modelParts.pagetable.color}
              emissive={modelParts.pagetable.color}
              emissiveIntensity={selected ? 0.7 : 0.25}
              transparent
              opacity={0.9 - i * 0.08}
            />
          </mesh>
        ))}
        <Html distanceFactor={9} position={[0, -0.5, 0]} center>
          <div className="pointer-events-none whitespace-nowrap rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
            Page Tables
          </div>
        </Html>
      </group>
    </Part>
  );
}

function RamPart({ selected, onSelect }: { selected: boolean; onSelect: (id: string) => void }) {
  const used = new Set([2, 5, 7, 10, 13, 14, 18]);
  const grid: [number, number][] = [];
  for (let x = 0; x < 5; x++) for (let z = 0; z < 4; z++) grid.push([x, z]);

  return (
    <Part position={[2.3, 0.1, 0]} selected={selected} onSelect={onSelect} id="ram">
      <group>
        {grid.map(([x, z], i) => (
          <mesh key={i} position={[x * 0.34 - 0.68, 0, z * 0.34 - 0.51]}>
            <boxGeometry args={[0.28, 0.28, 0.28]} />
            <meshStandardMaterial
              color={used.has(i) ? modelParts.ram.color : "#334155"}
              emissive={used.has(i) ? modelParts.ram.color : "#1e293b"}
              emissiveIntensity={used.has(i) ? (selected ? 0.8 : 0.45) : 0.1}
            />
          </mesh>
        ))}
        <Html distanceFactor={9} position={[0, -0.5, 0]} center>
          <div className="pointer-events-none whitespace-nowrap rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] text-amber-300">
            RAM Frames
          </div>
        </Html>
      </group>
    </Part>
  );
}

function SwapPart({ selected, onSelect }: { selected: boolean; onSelect: (id: string) => void }) {
  return (
    <Part position={[0, -1.6, 0]} selected={selected} onSelect={onSelect} id="swap">
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial
          color={modelParts.swap.color}
          emissive={modelParts.swap.color}
          emissiveIntensity={selected ? 0.8 : 0.3}
          roughness={0.5}
        />
      </mesh>
      <Html distanceFactor={9} position={[0, -0.45, 0]} center>
        <div className="pointer-events-none whitespace-nowrap rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] text-rose-300">
          Swap Storage
        </div>
      </Html>
    </Part>
  );
}

function ConnectorLines() {
  const points: [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(-2.4, 1.1, 0)],
    [new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(2.3, 0.6, 0)],
    [new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(0, -1.4, 0)],
  ];
  return (
    <>
      {points.map((pair, i) => (
        <line key={i}>
          <bufferGeometry
            attach="geometry"
            // eslint-disable-next-line react/no-unknown-property
            onUpdate={(geo: THREE.BufferGeometry) => geo.setFromPoints(pair)}
          />
          <lineBasicMaterial attach="material" color="#334155" transparent opacity={0.6} />
        </line>
      ))}
    </>
  );
}

export default function Scene({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#22d3ee" />
      <pointLight position={[-5, -3, -5]} intensity={40} color="#34d399" />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <group>
          <ConnectorLines />
          <MMUPart selected={selected === "mmu"} onSelect={onSelect} />
          <PageTablePart selected={selected === "pagetable"} onSelect={onSelect} />
          <RamPart selected={selected === "ram"} onSelect={onSelect} />
          <SwapPart selected={selected === "swap"} onSelect={onSelect} />
        </group>
      </Float>
    </group>
  );
}
